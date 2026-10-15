import { useEffect, useRef, useState } from "react";
import PageShell from "../components/layout/PageShell.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import AdBanner from "../components/common/AdBanner.jsx";
import usePageTitle from "../hooks/usePageTitle.js";
import useCoins from "../hooks/useCoins.js";
import { showToast } from "../components/common/toast.js";
import { getAdLoading } from "../services/analytics.js";
import Ads from "../services/ads.js";
import { safeGetItem, safeSetItem } from "../utils/storage.js";

// 🎡 KIDS ARCADE — "Spin & Stop": a skill-timing wheel. The wheel keeps
// speeding up while it spins — hit STOP at the right moment so a gold ₹
// segment lands under the pointer. ₹20 is the jackpot, 💣 pays nothing.
// Reward ad auto-loads every 5 spins.
const SP_BEST_KEY = "spin_stop_best";
const AD_EVERY_SPINS = 5;

const SEGMENTS = [
    { label: "₹2", coins: 2 },
    { label: "₹5", coins: 5 },
    { label: "💣", coins: 0 },
    { label: "₹10", coins: 10 },
    { label: "₹2", coins: 2 },
    { label: "₹20", coins: 20 },
    { label: "💣", coins: 0 },
    { label: "₹5", coins: 5 },
];
const SEG_DEG = 360 / SEGMENTS.length;

export default function SpinStop() {
    usePageTitle("Spin & Stop 🎡 | FF Skin Tool");
    const { addCoins } = useCoins();

    const [started, setStarted] = useState(false);
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [best, setBest] = useState(() => Number(safeGetItem(SP_BEST_KEY, "0")) || 0);
    const [totalWon, setTotalWon] = useState(0);
    const [spins, setSpins] = useState(0);

    const wheelRef = useRef(null);
    const anim = useRef({ rot: 0, speed: 0, mode: "idle", spinStart: 0 });
    // 🎁 one ad request at a time (interval ad + every-5-spins ad share this lock)
    const adBusyRef = useRef(false);
    // total spins completed (drives the every-5-spins ad)
    const spinCountRef = useRef(0);

    function showRewardAd(bonus, msg) {
        if (adBusyRef.current || getAdLoading()) return;
        adBusyRef.current = true;
        Ads.showRewarded((res) => {
            adBusyRef.current = false;
            if (res && res.breakStatus === "viewed") {
                addCoins(bonus);
                showToast(msg);
            }
        });
    }

    function settle(rot) {
        setSpinning(false);
        const idx = Math.floor((((360 - (rot % 360)) % 360) / SEG_DEG)) % SEGMENTS.length;
        const seg = SEGMENTS[idx];
        spinCountRef.current += 1;
        setSpins(spinCountRef.current);
        setResult(seg);
        if (seg.coins > 0) {
            addCoins(seg.coins);
            setTotalWon((t) => t + seg.coins);
            showToast(`🎯 ${seg.label} segment — +${seg.coins} coins!`);
            if (seg.coins > best) {
                setBest(seg.coins);
                safeSetItem(SP_BEST_KEY, String(seg.coins));
            }
        } else {
            showToast("💣 Bomb segment — no coins this spin!");
        }
        // 👑 every 5th spin → auto-load the reward ad (no popup, skips if an ad is already loading)
        if (spinCountRef.current % AD_EVERY_SPINS === 0) showRewardAd(5, "🎁 5 spins bonus: +5 coins!");
    }

    // rAF physics loop (speed up while spinning, decay when stopping)
    useEffect(() => {
        let raf;
        function frame() {
            const a = anim.current;
            if (a.mode === "spinning") {
                a.speed = Math.min(a.speed + 0.12, 16);
                if (Date.now() - a.spinStart > 15000) a.mode = "stopping"; // auto-stop safety
            } else if (a.mode === "stopping") {
                a.speed *= 0.94;
                if (a.speed < 0.05) {
                    a.speed = 0;
                    a.mode = "idle";
                    settle(a.rot);
                }
            }
            a.rot = (a.rot + a.speed) % 360;
            if (wheelRef.current) wheelRef.current.style.transform = `rotate(${a.rot}deg)`;
            raf = requestAnimationFrame(frame);
        }
        raf = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(raf);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [best]);

    function spin() {
        const a = anim.current;
        if (a.mode !== "idle") return;
        a.mode = "spinning";
        a.spinStart = Date.now();
        setSpinning(true);
        setResult(null);
        setStarted(true);
    }

    function stop() {
        const a = anim.current;
        if (a.mode === "spinning") a.mode = "stopping";
    }

    const grad = SEGMENTS
        .map((s, i) => `${i % 2 === 0 ? "#f5b52b" : "#232c4d"} ${i * SEG_DEG}deg ${(i + 1) * SEG_DEG}deg`)
        .join(", ");

    return (
        <PageShell>
            <PageHeader title="🎡 Spin & Stop" />
            <AdBanner bannerId="gpt-banner-spin-stop" placement="spin_stop" containerId="adsense-container" />

            <div className="cc-wrap sp-wrap">
                <div className="cc-hud">
                    <span>🏆 Best: {best}</span>
                    <span>🎁 Won: {totalWon}</span>
                    <span>🎡 Spins: {spins}</span>
                </div>

                <div className="sp-stage">
                    <div className="sp-pointer" aria-hidden="true">▼</div>
                    <div ref={wheelRef} className="sp-wheel" style={{ background: `conic-gradient(${grad})` }}>
                        {SEGMENTS.map((s, i) => (
                            <div key={i} className="sp-seg" style={{ transform: `rotate(${i * SEG_DEG + SEG_DEG / 2}deg)` }}>
                                <span className={`sp-seg-label${i % 2 === 0 ? "" : " dark"}`}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="sp-hub">
                        {!spinning ? (
                            <button className="sp-btn" onClick={spin}>SPIN</button>
                        ) : (
                            <button className="sp-btn stop" onClick={stop}>STOP</button>
                        )}
                    </div>
                </div>

                {result && (
                    <div className={`sp-result${result.coins > 0 ? " win" : " lose"}`}>
                        {result.coins > 0 ? `🎯 You won ${result.coins} coins!` : "💣 Bomb! Try again."}
                    </div>
                )}

                {!started && (
                    <div className="cc-overlay sp-howto">
                        <h2>🎡 Spin & Stop</h2>
                        <p>The wheel speeds up — hit STOP when a gold ₹ segment lands under the pointer!</p>
                        <p>₹2 = +2 · ₹5 = +5 · ₹10 = +10 · ₹20 = JACKPOT · 💣 = nothing</p>
                        <button className="cc-btn" onClick={spin}>▶ START SPINNING</button>
                    </div>
                )}

                <div className="cc-touchhint">👆 Tap SPIN → the wheel speeds up → tap STOP to land on a gold ₹! (Reward ad every 5 spins 🎁)</div>
            </div>
        </PageShell>
    );
}

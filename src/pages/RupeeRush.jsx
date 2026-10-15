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

// 🕹️ KIDS ARCADE — "Rupee Rush": higher/lower card guessing.
// Ek card dikhsay — next card ae ni value VADHARE hai ka KAM?
// Guess sahi → streak vadhare, galat → game over. Simple & addictive.
const RR_BEST_KEY = "rupee_rush_best";
const REWARD_EVERY_SEC = 60;

// card values 1..13 (Ace..King), displayed as ₹-themed card faces
function drawCard() {
    const v = 1 + Math.floor(Math.random() * 13);
    const name = v === 1 ? "A" : v === 11 ? "J" : v === 12 ? "Q" : v === 13 ? "K" : `${v}`;
    return { v, name };
}

export default function RupeeRush() {
    usePageTitle("Rupee Rush 💰 | FF Skin Tool");
    const { addCoins } = useCoins();

    const [cur, setCur] = useState(drawCard);
    const [next, setNext] = useState(null);   // revealed after guess
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [best, setBest] = useState(() => Number(safeGetItem(RR_BEST_KEY, "0")) || 0);
    const [msg, setMsg] = useState("🔼 Higher or 🔽 Lower? Make your guess!");
    const [busy, setBusy] = useState(false);
    const [over, setOver] = useState(false);
    const [shake, setShake] = useState(false);
    const stateRef = useRef({ score: 0 });
    stateRef.current.score = score;

    function guess(pickHigher) {
        if (busy || over) return;
        setBusy(true);
        const drawn = drawCard();
        setNext(drawn);
        setTimeout(() => {
            const isUp = drawn.v > cur.v;
            const isEq = drawn.v === cur.v;
            const win = isEq ? true : (pickHigher ? isUp : !isUp); // tie = safe (kid-friendly)
            if (win) {
                const ns = streak + 1;
                const pts = isEq ? 5 : 2;
                setStreak(ns);
                setScore((s) => s + pts);
                setMsg(isEq ? "🤝 Same card! You're safe — +5 bonus!" : `🎉 Correct guess! +${pts} pts`);
                // every 5 streak → real coins
                if (ns % 5 === 0) {
                    addCoins(5);
                    showToast(`🔥 ${ns} streak! +5 coins!`);
                }
                setTimeout(() => {
                    setCur(drawn);
                    setNext(null);
                    setBusy(false);
                }, 700);
            } else {
                setOver(true);
                setShake(true);
                setMsg("😵 Wrong! Game Over — try again!");
                setTimeout(() => setShake(false), 500);
                if (score > best) {
                    setBest(score);
                    safeSetItem(RR_BEST_KEY, String(score));
                }
                setBusy(false);
            }
        }, 600);
    }

    function restart() {
        setCur(drawCard()); setNext(null); setScore(0); setStreak(0);
        setOver(false); setMsg("🔼 Higher or 🔽 Lower? Make your guess!");
    }

    // 👑 reward ad every 1 minute from the moment the game page is opened (auto-load, no popup)
    useEffect(() => {
        const adBusy = { current: false };
        const t = setInterval(() => {
            if (adBusy.current || getAdLoading()) return;
            adBusy.current = true;
            Ads.showRewarded((result) => {
                adBusy.current = false;
                if (result && result.breakStatus === "viewed") {
                    setScore((s) => s + 10);
                    addCoins(3);
                    showToast("🎁 Ad bonus: +10 pts + 3 coins!");
                }
            });
        }, REWARD_EVERY_SEC * 1000);
        return () => clearInterval(t);
    }, [addCoins]);

    const cardFace = (c, label) => c ? (
        <div className="rr-card">
            <span className="rr-card-tl">{c.name}</span>
            <span className="rr-card-mid">₹{c.v}</span>
            <span className="rr-card-br">{c.name}</span>
            {label && <span className="rr-card-label">{label}</span>}
        </div>
    ) : <div className="rr-card rr-card-hidden">❓</div>;

    return (
        <PageShell>
            <PageHeader title="💰 Rupee Rush" />
            <AdBanner bannerId="gpt-banner-rupee-rush" placement="rupee_rush" containerId="adsense-container" />

            <div className={`rr-wrap${shake ? " rr-shake" : ""}`}>
                <div className="rr-hud">
                    <span>⭐ Score: {score}</span>
                    <span>🔥 Streak: {streak}</span>
                    <span>🏆 Best: {best}</span>
                </div>

                <div className="rr-msg">{msg}</div>

                <div className="rr-cards">
                    {cardFace(cur, "CURRENT")}
                    <div className="rr-vs">➡️</div>
                    {next ? cardFace(next, "NEXT") : <div className="rr-card rr-card-hidden">❓</div>}
                </div>

                {!over ? (
                    <div className="rr-btns">
                        <button className="rr-btn rr-up" disabled={busy} onClick={() => guess(true)}>🔼 HIGHER</button>
                        <button className="rr-btn rr-down" disabled={busy} onClick={() => guess(false)}>🔽 LOWER</button>
                    </div>
                ) : (
                    <button className="rr-btn rr-up" onClick={restart}>🔄 PLAY AGAIN</button>
                )}

                <p className="rr-note">Cards range 1–13 — check the ₹ value and guess. Every 5-streak = +5 real coins! 🪙</p>
            </div>
        </PageShell>
    );
}

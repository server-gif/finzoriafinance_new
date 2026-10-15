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

// 🏅 KIDS ARCADE — "Golden Scratch": a real scratch-card game. Drag your
// finger/mouse over the silver coating to scratch it away and reveal the
// 9 symbols underneath. Any symbol showing 3+ times pays coins instantly.
// Reward ad auto-loads every 1 minute while a card is in play.
const GS_BEST_KEY = "golden_scratch_best";
const REWARD_EVERY_SEC = 60;
const CANVAS_SIZE = 300;

const SYMBOLS = [
    { e: "🪙", coins: 2 },
    { e: "💰", coins: 10 },
    { e: "💎", coins: 20 },
    { e: "⭐", coins: 5 },
    { e: "🍀", coins: 3 },
];

function makeCells() {
    return Array.from({ length: 9 }, () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
}

export default function GoldenScratch() {
    usePageTitle("Golden Scratch 🏅 | FF Skin Tool");
    const { addCoins } = useCoins();

    const [cells, setCells] = useState(makeCells);
    const [revealed, setRevealed] = useState(false);
    const [win, setWin] = useState(0);
    const [winners, setWinners] = useState(() => new Set());
    const [best, setBest] = useState(() => Number(safeGetItem(GS_BEST_KEY, "0")) || 0);
    const [totalWon, setTotalWon] = useState(0);
    const [cards, setCards] = useState(0);

    const canvasRef = useRef(null);
    const scratching = useRef(false);

    // paint the silver coating on mount / new card
    useEffect(() => {
        const cv = canvasRef.current;
        if (!cv) return;
        const ctx = cv.getContext("2d");
        ctx.globalCompositeOperation = "source-over";
        const g = ctx.createLinearGradient(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        g.addColorStop(0, "#d7dce6");
        g.addColorStop(0.5, "#aeb6c6");
        g.addColorStop(1, "#c9cfdb");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        // shimmer stripes
        ctx.strokeStyle = "rgba(255,255,255,0.45)";
        ctx.lineWidth = 10;
        for (let i = -CANVAS_SIZE; i < CANVAS_SIZE * 2; i += 42) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i + CANVAS_SIZE, CANVAS_SIZE);
            ctx.stroke();
        }
        ctx.fillStyle = "#5a6478";
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "center";
        ctx.fillText("SCRATCH HERE!", CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 6);
        ctx.font = "bold 15px Arial";
        ctx.fillText("match 3 = WIN", CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 20);
    }, [cells, revealed]);

    function canvasPoint(e) {
        const rect = canvasRef.current.getBoundingClientRect();
        return {
            x: ((e.clientX - rect.left) / rect.width) * CANVAS_SIZE,
            y: ((e.clientY - rect.top) / rect.height) * CANVAS_SIZE,
        };
    }

    function eraseAt(p) {
        const ctx = canvasRef.current.getContext("2d");
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 24, 0, Math.PI * 2);
        ctx.fill();
    }

    function startScratch(e) {
        if (revealed) return;
        e.preventDefault();
        scratching.current = true;
        eraseAt(canvasPoint(e));
    }

    function scratch(e) {
        if (!scratching.current || revealed) return;
        eraseAt(canvasPoint(e));
    }

    // count how much coating is gone; auto-reveal past ~50%
    function endScratch() {
        if (!scratching.current || revealed) return;
        scratching.current = false;
        const ctx = canvasRef.current.getContext("2d");
        const data = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE).data;
        let cleared = 0, total = 0;
        for (let i = 3; i < data.length; i += 4 * 12) {
            total += 1;
            if (data[i] === 0) cleared += 1;
        }
        if (cleared / total > 0.5) revealCard();
    }

    function revealCard() {
        const counts = {};
        for (const c of cells) counts[c.e] = (counts[c.e] || 0) + 1;
        const winSet = new Set(Object.keys(counts).filter((k) => counts[k] >= 3));
        let gained = 0;
        for (const sym of SYMBOLS) if (winSet.has(sym.e)) gained += sym.coins;
        setWinners(winSet);
        setWin(gained);
        setRevealed(true);
        setCards((n) => n + 1);
        if (gained > 0) {
            addCoins(gained);
            setTotalWon((t) => t + gained);
            showToast(`🎉 3-of-a-kind! +${gained} coins!`);
            if (gained > best) {
                setBest(gained);
                safeSetItem(GS_BEST_KEY, String(gained));
            }
        } else {
            showToast("😅 No match this card — try a new one!");
        }
    }

    function newCard() {
        setCells(makeCells());
        setWinners(new Set());
        setWin(0);
        setRevealed(false);
    }

    // 👑 reward ad every 1 minute from the moment the game page is opened (auto-load, no popup)
    useEffect(() => {
        const adBusy = { current: false };
        const t = setInterval(() => {
            if (adBusy.current || getAdLoading()) return;
            adBusy.current = true;
            Ads.showRewarded((res) => {
                adBusy.current = false;
                if (res && res.breakStatus === "viewed") {
                    addCoins(5);
                    showToast("🎁 Ad bonus: +5 coins!");
                }
            });
        }, REWARD_EVERY_SEC * 1000);
        return () => clearInterval(t);
    }, [addCoins]);

    return (
        <PageShell>
            <PageHeader title="🏅 Golden Scratch" />
            <AdBanner bannerId="gpt-banner-golden-scratch" placement="golden_scratch" containerId="adsense-container" />

            <div className="cc-wrap gs-wrap">
                <div className="cc-hud">
                    <span>🏆 Best: {best}</span>
                    <span>🎁 Won: {totalWon}</span>
                    <span>🃏 Cards: {cards}</span>
                </div>

                <div className="gs-card">
                    <div className="gs-grid">
                        {cells.map((c, i) => (
                            <div key={i} className={`gs-cell${revealed && winners.has(c.e) ? " gs-win" : ""}`}>
                                {c.e}
                            </div>
                        ))}
                    </div>
                    {!revealed && (
                        <canvas
                            ref={canvasRef}
                            width={CANVAS_SIZE}
                            height={CANVAS_SIZE}
                            className="gs-canvas"
                            onPointerDown={startScratch}
                            onPointerMove={scratch}
                            onPointerUp={endScratch}
                            onPointerLeave={endScratch}
                        />
                    )}
                </div>

                {revealed && (
                    <div className={`sp-result${win > 0 ? " win" : " lose"}`}>
                        {win > 0 ? `🎉 Matched 3-of-a-kind! +${win} coins!` : "😅 No match — scratch a new card!"}
                    </div>
                )}

                <div className="gs-actions">
                    <button className="cc-btn" onClick={newCard}>🃏 NEW CARD</button>
                    {!revealed && <button className="cc-btn gs-peek" onClick={revealCard}>👀 REVEAL</button>}
                </div>

                <div className="cc-touchhint">👆 Scratch the silver coating with your finger/mouse — 3 same symbols = coins! 🎁 Bonus ad every 1 min: +5 coins</div>
            </div>
        </PageShell>
    );
}

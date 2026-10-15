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

// 🕹️ KIDS ARCADE — "Coin Catch": move the basket, catch falling coins,
// dodge the bombs. Simple, colourful, one-button fun. Every 50 points
// awards real coins. Reward ad auto-loads every 1 minute while playing.
const CC_HS_KEY = "coin_catch_hs";
const REWARD_EVERY_SEC = 60;
const FALL_MS = 28;          // tick speed
const SPAWN_EVERY = 14;      // ticks between spawns
const BASKET_W = 16;         // % of track width
const GAME_TIME = 60;        // seconds per round

const ITEMS = ["🪙", "💰", "💵", "✨", "💎"];

let nextId = 1;

function spawnItem(waves) {
    // bombs appear more often as the game speeds up
    const bombChance = 0.16 + waves * 0.02;
    const isBomb = Math.random() < bombChance;
    return {
        id: nextId++,
        x: 4 + Math.random() * 88, // % position on track
        y: 0,
        speed: 1.1 + waves * 0.35 + Math.random() * 0.8, // % per tick
        emoji: isBomb ? "💣" : ITEMS[Math.floor(Math.random() * ITEMS.length)],
        bomb: isBomb,
    };
}

export default function CoinCatch() {
    usePageTitle("Coin Catch 🪙 | FF Skin Tool");
    const { addCoins } = useCoins();

    const [running, setRunning] = useState(false);
    const [over, setOver] = useState(false);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [time, setTime] = useState(GAME_TIME);
    const [basketX, setBasketX] = useState(42);
    const [items, setItems] = useState([]);
    const [pop, setPop] = useState(null); // floating "+5" text
    const [hs, setHs] = useState(() => Number(safeGetItem(CC_HS_KEY, "0")) || 0);

    const stateRef = useRef({ score: 0, lives: 3, waves: 0, tick: 0 });
    const trackRef = useRef(null);
    const basketRef = useRef(basketX);
    basketRef.current = basketX;
    // 🎁 one ad request at a time (interval ad + game-over ad share this lock)
    const adBusyRef = useRef(false);
    // game-over ad fires only once per round
    const overAdFiredRef = useRef(false);

    function startGame() {
        stateRef.current = { score: 0, lives: 3, waves: 0, tick: 0 };
        setScore(0); setLives(3); setTime(GAME_TIME); setItems([]);
        setOver(false); setRunning(true);
        overAdFiredRef.current = false;
    }

    function endGame(finalScore) {
        setRunning(false); setOver(true);
        if (finalScore > hs) {
            setHs(finalScore);
            safeSetItem(CC_HS_KEY, String(finalScore));
            showToast(`🏆 New High Score: ${finalScore}!`);
        }
        // 👑 game over → auto-load the reward ad once (no popup, skips if an ad is already loading)
        if (!overAdFiredRef.current && !adBusyRef.current && !getAdLoading()) {
            overAdFiredRef.current = true;
            adBusyRef.current = true;
            Ads.showRewarded((result) => {
                adBusyRef.current = false;
                if (result && result.breakStatus === "viewed") {
                    addCoins(3);
                    showToast("🎁 Game-over bonus: +3 coins!");
                }
            });
        }
    }

    // main game loop
    useEffect(() => {
        if (!running) return;
        const t = setInterval(() => {
            const s = stateRef.current;
            s.tick += 1;
            s.waves = Math.floor(s.score / 50); // speed up every 50 pts
            if (s.tick % SPAWN_EVERY === 0 && s.tick / SPAWN_EVERY % 1 === 0) {
                setItems((prev) => [...prev, spawnItem(s.waves)]);
            }
            setItems((prev) => {
                const kept = [];
                let gained = 0, bombHit = false, missed = false;
                for (const it of prev) {
                    const ny = it.y + it.speed;
                    // catch zone: bottom band + horizontal overlap with basket
                    if (ny >= 84 && ny <= 96) {
                        const bL = basketRef.current, bR = basketRef.current + BASKET_W;
                        if (it.x + 3 >= bL && it.x - 3 <= bR) {
                            if (it.bomb) { bombHit = true; }
                            else { gained += it.emoji === "💎" ? 10 : 5; }
                            continue; // item consumed
                        }
                    }
                    if (ny > 100) { if (!it.bomb) missed = true; continue; }
                    kept.push({ ...it, y: ny });
                }
                if (gained > 0) {
                    s.score += gained;
                    setScore(s.score);
                    setPop({ id: Date.now(), text: `+${gained}` });
                    setTimeout(() => setPop(null), 600);
                    // real coin reward every 50 points
                    if (Math.floor(s.score / 50) > Math.floor((s.score - gained) / 50)) {
                        addCoins(5);
                        showToast(`🪙 ${s.score} points! +5 coins!`);
                    }
                }
                if (bombHit || missed) {
                    s.lives -= bombHit ? 1 : 0;
                    // missing a coin doesn't cost a life (kid-friendly), bombs do
                    if (bombHit) {
                        setLives(s.lives);
                        if (s.lives <= 0) { endGame(s.score); }
                    }
                }
                return kept;
            });
        }, FALL_MS);
        return () => clearInterval(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [running]);

    // countdown timer
    useEffect(() => {
        if (!running) return;
        const t = setInterval(() => {
            setTime((prev) => {
                if (prev <= 1) {
                    endGame(stateRef.current.score);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [running]);

    // 👑 reward ad every 1 minute from the moment the game page is opened (auto-load, no popup)
    useEffect(() => {
        const t = setInterval(() => {
            if (adBusyRef.current || getAdLoading()) return;
            adBusyRef.current = true;
            Ads.showRewarded((result) => {
                adBusyRef.current = false;
                if (result && result.breakStatus === "viewed") {
                    stateRef.current.score += 20;
                    setScore(stateRef.current.score);
                    addCoins(3);
                    showToast("🎁 Ad bonus: +20 points + 3 coins!");
                }
            });
        }, REWARD_EVERY_SEC * 1000);
        return () => clearInterval(t);
    }, [addCoins]);

    // keyboard controls
    useEffect(() => {
        function onKey(e) {
            if (!running) return;
            if (e.key === "ArrowLeft") setBasketX((x) => Math.max(0, x - 7));
            if (e.key === "ArrowRight") setBasketX((x) => Math.min(100 - BASKET_W, x + 7));
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [running]);

    // touch / mouse drag control
    function movePointer(clientX) {
        const el = trackRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const pct = ((clientX - rect.left) / rect.width) * 100 - BASKET_W / 2;
        setBasketX(Math.min(100 - BASKET_W, Math.max(0, pct)));
    }

    return (
        <PageShell>
            <PageHeader title="🪙 Coin Catch" />
            <AdBanner bannerId="gpt-banner-coin-catch" placement="coin_catch" containerId="adsense-container" />

            <div className="cc-wrap">
                <div className="cc-hud">
                    <span>⭐ {score}</span>
                    <span>❤️ {lives}</span>
                    <span>⏱️ {time}s</span>
                    <span>🏆 {hs}</span>
                </div>

                <div
                    className="cc-track"
                    ref={trackRef}
                    onTouchStart={(e) => movePointer(e.touches[0].clientX)}
                    onTouchMove={(e) => movePointer(e.touches[0].clientX)}
                    onMouseMove={(e) => e.buttons > 0 && movePointer(e.clientX)}
                >
                    {items.map((it) => (
                        <span key={it.id} className={`cc-item${it.bomb ? " cc-bomb" : ""}`} style={{ left: `${it.x}%`, top: `${it.y}%` }}>
                            {it.emoji}
                        </span>
                    ))}
                    {pop && <span className="cc-pop">{pop.text}</span>}
                    <div className="cc-basket" style={{ left: `${basketX}%` }}>🧺</div>

                    {!running && !over && (
                        <div className="cc-overlay">
                            <h2>🪙 Coin Catch</h2>
                            <p>Catch the falling coins in your basket 🧺!<br />💣 Don't touch the bombs!</p>
                            <p>💎 = 10 pts · 🪙 = 5 pts · Every 50 pts = +5 real coins</p>
                            <button className="cc-btn" onClick={startGame}>▶ START GAME</button>
                        </div>
                    )}
                    {over && (
                        <div className="cc-overlay">
                            <h2>🎉 Game Over!</h2>
                            <p>Your score: <b>{score}</b> {score >= hs && score > 0 ? "🏆 NEW BEST!" : ""}</p>
                            <button className="cc-btn" onClick={startGame}>🔄 PLAY AGAIN</button>
                        </div>
                    )}
                </div>

                <div className="cc-touchhint">👆 Drag across the screen ◀ ▶ (keyboard arrows work too)</div>
            </div>
        </PageShell>
    );
}

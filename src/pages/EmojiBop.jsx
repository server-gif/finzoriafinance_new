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

// 😺 KIDS ARCADE — "Emoji Bop": whack-a-mole style emoji fun. Emojis pop
// out of 9 holes — tap the happy ones before they hide, never tap the
// bombs! Game gets faster as your score grows. Reward ad auto-loads
// every 1 minute while playing.
const EB_HS_KEY = "emoji_bop_hs";
const REWARD_EVERY_SEC = 60;
const GAME_TIME = 45;        // seconds
const TICK_MS = 100;

const GOOD = [
    { e: "😺", pts: 5 },
    { e: "🐶", pts: 5 },
    { e: "🐸", pts: 5 },
    { e: "🐵", pts: 5 },
    { e: "🦄", pts: 15 }, // rare jackpot emoji
];
const BAD = ["💣", "👹"];

let ebId = 1;

export default function EmojiBop() {
    usePageTitle("Emoji Bop 😺 | FF Skin Tool");
    const { addCoins } = useCoins();

    const [running, setRunning] = useState(false);
    const [over, setOver] = useState(false);
    const [grid, setGrid] = useState(Array(9).fill(null));
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [time, setTime] = useState(GAME_TIME);
    const [combo, setCombo] = useState(0);
    const [pop, setPop] = useState(null); // floating "+5" text
    const [hs, setHs] = useState(() => Number(safeGetItem(EB_HS_KEY, "0")) || 0);

    const s = useRef({ score: 0, lives: 3, tick: 0, time: GAME_TIME, combo: 0 });
    // 🎁 one ad request at a time (interval ad + game-over ad share this lock)
    const adBusyRef = useRef(false);
    // game-over ad fires only once per round
    const overAdFiredRef = useRef(false);

    function startGame() {
        s.current = { score: 0, lives: 3, tick: 0, time: GAME_TIME, combo: 0 };
        setGrid(Array(9).fill(null));
        setScore(0); setLives(3); setTime(GAME_TIME); setCombo(0);
        setOver(false); setRunning(true);
        overAdFiredRef.current = false;
    }

    function endGame(finalScore) {
        setRunning(false); setOver(true);
        if (finalScore > hs) {
            setHs(finalScore);
            safeSetItem(EB_HS_KEY, String(finalScore));
            showToast(`🏆 New High Score: ${finalScore}!`);
        }
        // 👑 game over → auto-load the reward ad once (no popup, skips if an ad is already loading)
        if (!overAdFiredRef.current && !adBusyRef.current && !getAdLoading()) {
            overAdFiredRef.current = true;
            adBusyRef.current = true;
            Ads.showRewarded((res) => {
                adBusyRef.current = false;
                if (res && res.breakStatus === "viewed") {
                    addCoins(3);
                    showToast("🎁 Game-over bonus: +3 coins!");
                }
            });
        }
    }

    // main loop: ttl countdown + spawning (faster with score waves)
    useEffect(() => {
        if (!running) return;
        const t = setInterval(() => {
            const st = s.current;
            st.tick += 1;
            const wave = Math.floor(st.score / 100);
            const spawnEvery = Math.max(4, 9 - wave);   // ticks between spawns
            const ttl = Math.max(7, 12 - wave);          // how long an emoji stays up

            setGrid((prev) => {
                let next = prev.map((c) => (c ? (c.ttl > 1 ? { ...c, ttl: c.ttl - 1 } : null) : null));
                if (st.tick % spawnEvery === 0) {
                    const empties = next.map((c, i) => (c ? -1 : i)).filter((i) => i >= 0);
                    const spawns = Math.random() < 0.35 && empties.length > 1 ? 2 : 1;
                    for (let k = 0; k < spawns && empties.length; k++) {
                        const pick = empties.splice(Math.floor(Math.random() * empties.length), 1)[0];
                        const isBad = Math.random() < 0.2 + wave * 0.03;
                        const g = GOOD[Math.floor(Math.random() * GOOD.length)];
                        next[pick] = isBad
                            ? { id: ebId++, e: BAD[Math.floor(Math.random() * BAD.length)], bad: true, ttl }
                            : { id: ebId++, e: g.e, pts: g.pts, bad: false, ttl };
                    }
                }
                return next;
            });

            if (st.tick % 10 === 0) {
                st.time -= 1;
                setTime(st.time);
                if (st.time <= 0) endGame(st.score);
            }
        }, TICK_MS);
        return () => clearInterval(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [running]);

    // 👑 reward ad every 1 minute from the moment the game page is opened (auto-load, no popup)
    useEffect(() => {
        const t = setInterval(() => {
            if (adBusyRef.current || getAdLoading()) return;
            adBusyRef.current = true;
            Ads.showRewarded((res) => {
                adBusyRef.current = false;
                if (res && res.breakStatus === "viewed") {
                    s.current.score += 20;
                    setScore(s.current.score);
                    addCoins(3);
                    showToast("🎁 Ad bonus: +20 points + 3 coins!");
                }
            });
        }, REWARD_EVERY_SEC * 1000);
        return () => clearInterval(t);
    }, [addCoins]);

    function bop(i) {
        if (!running) return;
        const st = s.current;
        setGrid((prev) => {
            const c = prev[i];
            if (!c) return prev;
            const next = [...prev];
            next[i] = null;
            if (c.bad) {
                st.lives -= 1;
                st.combo = 0;
                setLives(st.lives);
                setCombo(0);
                setPop({ id: Date.now(), text: "💥", x: i });
                setTimeout(() => setPop(null), 500);
                if (st.lives <= 0) endGame(st.score);
            } else {
                st.combo += 1;
                const bonus = st.combo >= 5 ? 5 : 0; // combo streak bonus
                const gained = c.pts + bonus;
                st.score += gained;
                setScore(st.score);
                setCombo(st.combo);
                setPop({ id: Date.now(), text: `+${gained}`, x: i });
                setTimeout(() => setPop(null), 500);
                // real coin reward every 50 points
                if (Math.floor(st.score / 50) > Math.floor((st.score - gained) / 50)) {
                    addCoins(5);
                    showToast(`🪙 ${st.score} points! +5 coins!`);
                }
            }
            return next;
        });
    }

    return (
        <PageShell>
            <PageHeader title="😺 Emoji Bop" />
            <AdBanner bannerId="gpt-banner-emoji-bop" placement="emoji_bop" containerId="adsense-container" />

            <div className="cc-wrap eb-wrap">
                <div className="cc-hud">
                    <span>⭐ {score}</span>
                    <span>❤️ {lives}</span>
                    <span>⏱️ {time}s</span>
                    <span>🏆 {hs}</span>
                    {combo >= 3 && <span className="eb-combo">🔥 x{combo}</span>}
                </div>

                <div className="eb-board">
                    {grid.map((c, i) => (
                        <div key={i} className="eb-hole" onPointerDown={() => bop(i)}>
                            <div className="eb-cave" />
                            {c && <span className={`eb-emoji${c.bad ? " eb-bad" : ""}`}>{c.e}</span>}
                            {pop && pop.x === i && <span className="eb-pop">{pop.text}</span>}
                        </div>
                    ))}
                    {!running && !over && (
                        <div className="cc-overlay">
                            <h2>😺 Emoji Bop</h2>
                            <p>Tap the emojis as they pop out of the holes!<br />Happy faces 😺 🐸 = +5 · Unicorn = +15 · Bomb 💣 👹 = 💥 you lose a life!</p>
                            <p>5-combo streak = +5 bonus 🔥 · Every 50 points = +5 real coins</p>
                            <button className="cc-btn" onClick={startGame}>▶ START GAME</button>
                        </div>
                    )}
                    {over && (
                        <div className="cc-overlay">
                            <h2>🎉 Time's Up!</h2>
                            <p>Your score: <b>{score}</b> {score >= hs && score > 0 ? "🏆 NEW BEST!" : ""}</p>
                            <button className="cc-btn" onClick={startGame}>🔄 PLAY AGAIN</button>
                        </div>
                    )}
                </div>

                <div className="cc-touchhint">👆 Tap the happy emojis — don't touch the 💣 bombs! (Bonus ad every 1 min 🎁)</div>
            </div>
        </PageShell>
    );
}

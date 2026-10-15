import { useEffect, useMemo, useRef, useState } from "react";
import PageShell from "../components/layout/PageShell.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import AdBanner from "../components/common/AdBanner.jsx";
import usePageTitle from "../hooks/usePageTitle.js";
import useCoins from "../hooks/useCoins.js";
import { showToast } from "../components/common/toast.js";
import { getAdLoading } from "../services/analytics.js";
import Ads from "../services/ads.js";
import { safeGetItem, safeSetItem } from "../utils/storage.js";

// 🕹️ KIDS ARCADE — "Money Match": memory pairs game with money emojis.
// Flip 2 cards at a time, find all pairs fastest. 3 difficulty levels.
// Reward ad auto-loads every 1 minute while playing.
const MM_BEST_KEY = "money_match_best";
const REWARD_EVERY_SEC = 60;

const EMOJIS = ["🪙", "💰", "💵", "💎", "👑", "🏦", "📈", "🧺", "🎁", "⭐", "🚀", "🍀"];

const LEVELS = [
    { id: "easy", label: "😃 Easy (4×3)", pairs: 6 },
    { id: "medium", label: "🤔 Medium (4×4)", pairs: 8 },
    { id: "hard", label: "🧠 Hard (6×4)", pairs: 12 },
];

function buildDeck(pairs) {
    const picks = EMOJIS.slice(0, pairs);
    const deck = [...picks, ...picks].map((e, i) => ({ id: i, emoji: e }));
    // shuffle
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

export default function MoneyMatch() {
    usePageTitle("Money Match 🃏 | FF Skin Tool");
    const { addCoins } = useCoins();

    const [level, setLevel] = useState("easy");
    const [deck, setDeck] = useState(() => buildDeck(6));
    const [flipped, setFlipped] = useState([]);   // indices currently face-up (unmatched)
    const [matched, setMatched] = useState([]);    // indices already matched
    const [moves, setMoves] = useState(0);
    const [secs, setSecs] = useState(0);
    const [started, setStarted] = useState(false);
    const [won, setWon] = useState(false);
    const [best, setBest] = useState(() => {
        try { return JSON.parse(safeGetItem(MM_BEST_KEY, "{}")) || {}; } catch { return {}; }
    });
    const lockRef = useRef(false);
    // 🎁 one ad request at a time (interval ad + win ad share this lock)
    const adBusyRef = useRef(false);
    // win ad fires only once per round
    const winAdFiredRef = useRef(false);

    const pairs = LEVELS.find((l) => l.id === level).pairs;

    function reset(lv) {
        const chosen = lv || level;
        setLevel(chosen);
        setDeck(buildDeck(LEVELS.find((l) => l.id === chosen).pairs));
        setFlipped([]); setMatched([]); setMoves(0); setSecs(0);
        setStarted(true); setWon(false); lockRef.current = false;
        winAdFiredRef.current = false;
    }

    // timer
    useEffect(() => {
        if (!started || won) return;
        const t = setInterval(() => setSecs((s) => s + 1), 1000);
        return () => clearInterval(t);
    }, [started, won]);

    // 👑 reward ad every 1 minute from the moment the game page is opened (auto-load, no popup)
    useEffect(() => {
        const t = setInterval(() => {
            if (adBusyRef.current || getAdLoading()) return;
            adBusyRef.current = true;
            Ads.showRewarded((result) => {
                adBusyRef.current = false;
                if (result && result.breakStatus === "viewed") {
                    addCoins(3);
                    showToast("🎁 Ad bonus: +3 coins!");
                }
            });
        }, REWARD_EVERY_SEC * 1000);
        return () => clearInterval(t);
    }, [addCoins]);

    function flip(idx) {
        if (lockRef.current || won || matched.includes(idx) || flipped.includes(idx)) return;
        if (!started) reset();
        const next = [...flipped, idx];
        setFlipped(next);
        if (next.length === 2) {
            lockRef.current = true;
            setMoves((m) => m + 1);
            const [a, b] = next;
            const isMatch = deck[a].emoji === deck[b].emoji;
            setTimeout(() => {
                if (isMatch) {
                    const newMatched = [...matched, a, b];
                    setMatched(newMatched);
                    addCoins(1); // small instant payout per pair
                    if (newMatched.length === deck.length) {
                        setWon(true);
                        const bonus = pairs * 2;
                        addCoins(bonus);
                        showToast(`🎉 All pairs! +${bonus} bonus coins!`);
                        const nb = { ...best };
                        const key = `${pairs}`;
                        if (!nb[key] || moves < nb[key].moves) {
                            nb[key] = { moves: moves + 1, secs };
                            setBest(nb);
                            safeSetItem(MM_BEST_KEY, JSON.stringify(nb));
                        }
                        // 👑 win → auto-load the reward ad once (no popup, skips if an ad is already loading)
                        if (!winAdFiredRef.current && !adBusyRef.current && !getAdLoading()) {
                            winAdFiredRef.current = true;
                            adBusyRef.current = true;
                            Ads.showRewarded((result) => {
                                adBusyRef.current = false;
                                if (result && result.breakStatus === "viewed") {
                                    addCoins(3);
                                    showToast("🎁 Win bonus: +3 coins!");
                                }
                            });
                        }
                    }
                }
                setFlipped([]);
                lockRef.current = false;
            }, isMatch ? 350 : 750);
        }
    }

    const timerStr = useMemo(() => `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`, [secs]);
    const cols = pairs >= 12 ? 6 : 4;

    return (
        <PageShell>
            <PageHeader title="🃏 Money Match" />
            <AdBanner bannerId="gpt-banner-money-match" placement="money_match" containerId="adsense-container" />

            <div className="mm-wrap">
                <div className="mm-levels">
                    {LEVELS.map((l) => (
                        <button key={l.id} className={`mm-level${level === l.id ? " active" : ""}`} onClick={() => reset(l.id)}>{l.label}</button>
                    ))}
                </div>

                <div className="mm-hud">
                    <span>🎯 Moves: {moves}</span>
                    <span>⏱️ {timerStr}</span>
                    <span>✅ {matched.length / 2}/{pairs}</span>
                    {best[`${pairs}`] && <span>🏆 Best: {best[`${pairs}`].moves}</span>}
                </div>

                <div className="mm-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                    {deck.map((card, idx) => {
                        const up = flipped.includes(idx) || matched.includes(idx);
                        return (
                            <button key={card.id} className={`mm-card${up ? " up" : ""}${matched.includes(idx) ? " done" : ""}`} onClick={() => flip(idx)}>
                                {up ? <span className="mm-emoji">{card.emoji}</span> : <span className="mm-back">💭</span>}
                            </button>
                        );
                    })}
                </div>

                {won && (
                    <div className="mm-win">
                        🎉 Completed in {moves} moves · {timerStr}
                        <button className="mm-btn" onClick={() => reset()}>🔄 PLAY AGAIN</button>
                    </div>
                )}
                {!started && !won && (
                    <div className="mm-hint">Flip 2 cards — match the same emojis to make a pair! +1 coin per pair 🪙</div>
                )}
            </div>
        </PageShell>
    );
}

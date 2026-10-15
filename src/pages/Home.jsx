import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/layout/PageShell.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import AdBanner from "../components/common/AdBanner.jsx";
import GameCard from "../components/common/GameCard.jsx";
import OopsPopup from "../components/feature/OopsPopup.jsx";
import useCoins from "../hooks/useCoins.js";
import usePageTitle from "../hooks/usePageTitle.js";
import { showAdWithLogic, getAdLoading } from "../services/analytics.js";
import { showToast, showErrorToast } from "../components/common/toast.js";

const REWARD_CARDS = [
    { img: "/assets/robux/Budget.png", href: "/budget-challenge", alt: "Budget Challenge" },
    { img: "/assets/robux/spinner.webp", href: "/spin_to_win", alt: "Spin to Win" },
    { img: "/assets/video/money_match_poster.webp", title: "Money Match", href: "/money-match", alt: "Money Match", premium: true },
    { img: "/assets/robux/scrapper_main.webp", href: "/scratch-win", alt: "Scratch Win" },
    { img: "/assets/robux/quiz_main.webp", href: "/quiz", alt: "Finance Quiz" },
    { img: "/assets/robux/meme.webp", href: "/meme", alt: "Finance Memes" },
];

export default function Home() {
    usePageTitle("FF Skin Tool");
    const navigate = useNavigate();
    const { coins, addCoins, setCoinsValue } = useCoins();

    const [earnLoading, setEarnLoading] = useState(false);
    const [oopsOpen, setOopsOpen] = useState(false);
    const [pendingGame, setPendingGame] = useState(null);

    function handleEarn() {
        if (earnLoading || getAdLoading()) return;
        setEarnLoading(true);
        showAdWithLogic((result) => {
            if (result && result.breakStatus === "viewed") {
                addCoins(10);
                showToast();
            } else {
                showErrorToast();
            }
            setEarnLoading(false);
        });
    }

    function handleCardClick(e, href) {
        e.preventDefault();
        e.stopPropagation();
        const required = 10;
        if (coins < required) {
            setPendingGame(href);
            setOopsOpen(true);
        } else {
            setCoinsValue(coins - required);
            navigate(href);
        }
    }

    return (
        <PageShell>
            <PageHeader title="FF Skin Tool" backClassName="home-back-button" />

            <AdBanner bannerId="gpt-banner-home-top" placement="home_top" containerId="adsense-container" />

            <div className="resp_choose_game">
                <div className="choose_game" style={{ marginTop: "5px" }}>
                    <div className="redeem-coin">
                        <img src="/assets/icons/coin-earn.png" alt="" />
                        <span id="coin">{coins}</span>
                    </div>
                    <div className="earn-coin-btn">
                        <button id="earnCoinBtn" disabled={earnLoading} onClick={handleEarn}>
                            {!earnLoading && <img src="/assets/icons/coin.png" alt="" />}
                            {earnLoading ? "Loading Ad... ⏳" : "Earn Free Coins"}
                        </button>
                        <span className="ad-tag-earn">Ad</span>
                    </div>
                </div>
            </div>

            {/* 🕹️ Kids Arcade Section — coin video poster pulls the user into Coin Catch (10-coin gate + OopsPopup) */}
            <div className="premium_section">
                <a href="/coin-catch" onClick={(e) => handleCardClick(e, "/coin-catch")}>
                    <div className="premium_hero">
                        <video className="premium_video" autoPlay loop muted playsInline preload="auto" poster="/assets/video/coin_catch_poster.webp">
                            <source src="/assets/video/coin_fall.mp4" type="video/mp4" />
                        </video>
                        <div className="premium_rain" aria-hidden="true">
                            <span style={{ left: "6%", animationDelay: "0s", animationDuration: "3.6s" }}>💰</span>
                            <span style={{ left: "20%", animationDelay: "1.2s", animationDuration: "4.4s" }}>🪙</span>
                            <span style={{ left: "36%", animationDelay: "0.6s", animationDuration: "3.2s" }}>₹</span>
                            <span style={{ left: "52%", animationDelay: "1.8s", animationDuration: "4s" }}>✨</span>
                            <span style={{ left: "66%", animationDelay: "0.3s", animationDuration: "3.8s" }}>💵</span>
                            <span style={{ left: "81%", animationDelay: "1.5s", animationDuration: "4.6s" }}>🪙</span>
                            <span style={{ left: "93%", animationDelay: "0.9s", animationDuration: "3.4s" }}>💰</span>
                        </div>
                        <div className="premium_hero_shine" aria-hidden="true"></div>
                        <div className="premium_hero_overlay">
                            <div className="premium_hero_title">Coin Catch</div>
                            <div className="premium_hero_play">▶ PLAY NOW</div>
                        </div>
                    </div>
                </a>
            </div>

            <AdBanner bannerId="gpt-banner-home-middle" placement="home_middle" containerId="adsense-container-2" />

            {/* 😺 Emoji Bop banner */}
            <div className="game_section" style={{ height: "auto" }}>
                <div className="rewards">
                    <div className="game_section2 new-game-banner" onClick={(e) => handleCardClick(e, "/emoji-bop")}>
                        <a href="/emoji-bop" className="game_section3">
                            <div className="poster_fx">
                                <img src="/assets/video/emoji_bop_poster.webp" className="homeimage" alt="Emoji Bop" loading="eager" />
                                <div className="premium_hero_shine" aria-hidden="true"></div>
                                <span className="pf-emoji" style={{ left: "20%", animationDelay: "0.3s" }}>😺</span>
                                <span className="pf-emoji" style={{ left: "46%", animationDelay: "1.2s" }}>✨</span>
                                <span className="pf-emoji" style={{ left: "70%", animationDelay: "0.1s" }}>💣</span>
                                <span className="pf-emoji" style={{ left: "88%", animationDelay: "1.8s" }}>🪙</span>
                                <span className="pf-ring" aria-hidden="true"></span>
                                <span className="pf-hot">✨ NEW</span>
                            </div>
                        </a>
                    </div>
                </div>
            </div>

            <div className="game_section" style={{ height: "auto" }}>
                <div className="game_section1">
                    {REWARD_CARDS.map((card, i) => (
                        <Fragment key={card.href}>
                            {/* 🎡 Spin & Stop banner — sits right above the Meme card */}
                            {i === REWARD_CARDS.length - 1 && (
                                <div className="game_section2 rewards earnCoin_section2 new-game-banner in-grid-banner" onClick={(e) => handleCardClick(e, "/spin-stop")}>
                                    <a href="/spin-stop" className="game_section3">
                                        <div className="poster_fx">
                                            <img src="/assets/video/spin_stop_poster.webp" className="homeimage" alt="Spin & Stop" loading="eager" />
                                            <div className="premium_hero_shine" aria-hidden="true"></div>
                                            <span className="pf-emoji" style={{ left: "18%", animationDelay: "0.2s" }}>🎡</span>
                                            <span className="pf-emoji" style={{ left: "48%", animationDelay: "1.3s" }}>✨</span>
                                            <span className="pf-emoji" style={{ left: "74%", animationDelay: "0.7s" }}>🪙</span>
                                            <span className="pf-emoji" style={{ left: "90%", animationDelay: "1.9s" }}>💰</span>
                                            <span className="pf-ring" aria-hidden="true"></span>
                                            <span className="pf-hot">✨ NEW</span>
                                        </div>
                                    </a>
                                </div>
                            )}
                            <div className={`game_section2 rewards earnCoin_section2${card.premium ? " premium-game-slot" : ""}`} onClick={(e) => handleCardClick(e, card.href)}>
                            <a href={card.href} className="game_section3">
                                <div className="game_section4">
                                    {card.premium ? (
                                        <div className="poster_fx">
                                            <img src={card.img} alt={card.alt} loading="eager" className="game_section_img" />
                                            <div className="premium_hero_shine" aria-hidden="true"></div>
                                            <span className="pf-emoji" style={{ left: "14%", animationDelay: "0s" }}>🪙</span>
                                            <span className="pf-emoji" style={{ left: "42%", animationDelay: "1.1s" }}>✨</span>
                                            <span className="pf-emoji" style={{ left: "68%", animationDelay: "1.8s" }}>💰</span>
                                            <span className="pf-emoji" style={{ left: "88%", animationDelay: "0.6s" }}>🪙</span>
                                            <span className="pf-ring" aria-hidden="true"></span>
                                            <span className="pf-hot">🔥 HOT</span>
                                        </div>
                                    ) : (
                                        <picture>
                                            <img src={card.img} alt={card.alt} loading="eager" className="game_section_img" />
                                        </picture>
                                    )}
                                </div>
                            </a>
                        </div>
                        </Fragment>
                    ))}
                </div>
            </div>

            <div className="game_section" style={{ height: "auto" }}>
                {/* 🏅 NEW: Golden Scratch — scratch-card game */}
                <div className="rewards">
                    <div className="game_section2 new-game-banner" onClick={(e) => handleCardClick(e, "/golden-scratch")}>
                        <a href="/golden-scratch" className="game_section3">
                            <div className="poster_fx">
                                <img src="/assets/video/golden_scratch_poster.webp" className="homeimage" alt="Golden Scratch" loading="eager" />
                                <div className="premium_hero_shine" aria-hidden="true"></div>
                                <span className="pf-emoji" style={{ left: "16%", animationDelay: "0.9s" }}>🪙</span>
                                <span className="pf-emoji" style={{ left: "44%", animationDelay: "0.1s" }}>💎</span>
                                <span className="pf-emoji" style={{ left: "70%", animationDelay: "1.6s" }}>✨</span>
                                <span className="pf-emoji" style={{ left: "88%", animationDelay: "0.5s" }}>💰</span>
                                <span className="pf-ring" aria-hidden="true"></span>
                                <span className="pf-hot">✨ NEW</span>
                            </div>
                        </a>
                    </div>
                </div>
            </div>

            {/* 🕹️ Kids Arcade — Rupee Rush (below the bottom calculators) */}
            <div className="game_section" style={{ height: "auto" }}>
                <div className="rewards premium-banner-slot">
                    <a href="/rupee-rush" onClick={(e) => handleCardClick(e, "/rupee-rush")}>
                        <div className="poster_fx">
                            <img src="/assets/video/rupee_rush_poster.webp" className="homeimage" alt="Rupee Rush" />
                            <div className="premium_hero_shine" aria-hidden="true"></div>
                            <span className="pf-emoji" style={{ left: "16%", animationDelay: "0.4s" }}>💵</span>
                            <span className="pf-emoji" style={{ left: "46%", animationDelay: "0s" }}>✨</span>
                            <span className="pf-emoji" style={{ left: "72%", animationDelay: "1.4s" }}>🪙</span>
                            <span className="pf-emoji" style={{ left: "90%", animationDelay: "2s" }}>💰</span>
                            <span className="pf-ring" aria-hidden="true"></span>
                            <span className="pf-hot">🔥 HOT</span>
                        </div>
                    </a>
                </div>
            </div>

            <OopsPopup
                open={oopsOpen}
                gameUrl={pendingGame}
                navigate={navigate}
                onClose={() => setOopsOpen(false)}
            />
        </PageShell>
    );
}

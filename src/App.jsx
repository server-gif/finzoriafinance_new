import { useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index.jsx";
import Home from "./pages/Home.jsx";
import Meme from "./pages/Meme.jsx";
import Quiz from "./pages/Quiz.jsx";
import ScratchWin from "./pages/ScratchWin.jsx";
import SpinToWin from "./pages/SpinToWin.jsx";
import SipCalculator from "./pages/SipCalculator.jsx";
import EmiCalculator from "./pages/EmiCalculator.jsx";
import CompoundInterestCalculator from "./pages/CompoundInterestCalculator.jsx";
import CloudCostCalculator from "./pages/CloudCostCalculator.jsx";
import SavingsGoalCalculator from "./pages/SavingsGoalCalculator.jsx";
import BudgetChallenge from "./pages/BudgetChallenge.jsx";
import BudgetChallengePlay from "./pages/BudgetChallengePlay.jsx";
import BudgetChallengeReward from "./pages/BudgetChallengeReward.jsx";
import FinanceTips from "./pages/FinanceTips.jsx";
import CloudMatch from "./pages/CloudMatch.jsx";
import CoinCatch from "./pages/CoinCatch.jsx";
import MoneyMatch from "./pages/MoneyMatch.jsx";
import RupeeRush from "./pages/RupeeRush.jsx";
import SpinStop from "./pages/SpinStop.jsx";
import GoldenScratch from "./pages/GoldenScratch.jsx";
import EmojiBop from "./pages/EmojiBop.jsx";
import Ads from "./services/ads.js";

// All page routes (clean path + .html alias for backwards compat).
const PAGES = [
    ["/home", Home],
    ["/meme", Meme],
    ["/quiz", Quiz],
    ["/scratch-win", ScratchWin],
    ["/spin_to_win", SpinToWin],
    ["/sip-calculator", SipCalculator],
    ["/emi-calculator", EmiCalculator],
    ["/compound-interest", CompoundInterestCalculator],
    ["/cloud-cost", CloudCostCalculator],
    ["/savings-goal", SavingsGoalCalculator],
    ["/budget-challenge", BudgetChallenge],
    ["/budget-challenge-play", BudgetChallengePlay],
    ["/budget-challenge-reward", BudgetChallengeReward],
    ["/finance-tips", FinanceTips],
    ["/cloud-match", CloudMatch],
    ["/coin-catch", CoinCatch],
    ["/money-match", MoneyMatch],
    ["/rupee-rush", RupeeRush],
    ["/spin-stop", SpinStop],
    ["/golden-scratch", GoldenScratch],
    ["/emoji-bop", EmojiBop],
];

export default function App() {
    const startupFiredRef = useRef(false);
    useEffect(() => {
        const SESSION_KEY = "startup_rewarded_shown";
        function fireStartupRewarded() {
            if (startupFiredRef.current) return;
            if (sessionStorage.getItem(SESSION_KEY) === "1") return;
            startupFiredRef.current = true;
            sessionStorage.setItem(SESSION_KEY, "1");
            Ads.showRewarded((result) => {
                console.log("[Startup Rewarded] result:", result && result.breakStatus);
            });
        }
        const t = setTimeout(fireStartupRewarded, 300);
        if (window.location.hash === "#goog_rewarded") {
            sessionStorage.removeItem(SESSION_KEY);
            fireStartupRewarded();
        }
        return () => clearTimeout(t);
    }, []);

    return (
        <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/index.html" element={<Index />} />
            {PAGES.map(([path, El]) => (
                <Route key={path} path={path} element={<El />} />
            ))}
            {PAGES.map(([path, El]) => (
                <Route key={`${path}.html`} path={`${path}.html`} element={<El />} />
            ))}
            {/* Unknown URL -> landing */}
            <Route path="*" element={<Index />} />
        </Routes>
    );
}

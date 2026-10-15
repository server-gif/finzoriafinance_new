import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/layout/PageShell.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import AdBanner from "../components/common/AdBanner.jsx";
import usePageTitle from "../hooks/usePageTitle.js";
import { showToast } from "../components/common/toast.js";
import { showAdWithLogic, getAdLoading } from "../services/analytics.js";
import { safeGetItem, safeSetItem } from "../utils/storage.js";

const EXPENSES = [
    { name: "Rent / Housing", category: "needs" },
    { name: "Groceries", category: "needs" },
    { name: "Electricity Bill", category: "needs" },
    { name: "Internet / Cloud", category: "needs" },
    { name: "Movie Night", category: "wants" },
    { name: "New Gadget", category: "wants" },
    { name: "Dining Out", category: "wants" },
    { name: "Subscriptions", category: "wants" },
    { name: "SIP Investment", category: "savings" },
    { name: "Emergency Fund", category: "savings" },
    { name: "Retirement Fund", category: "savings" },
    { name: "Cloud Courses", category: "savings" },
];

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

// Budget Challenge — Page 2 of 3 (allocate). Coming from /budget-challenge.
// "Check Budget" runs the ad logic, then moves to the result page.
export default function BudgetChallengePlay() {
    usePageTitle("Budget Challenge");
    const navigate = useNavigate();
    const income = parseInt(safeGetItem("budget_income"), 10) || 0;
    const [expenses] = useState(() => shuffle(EXPENSES));
    const [allocations, setAllocations] = useState({});
    const [adLoading, setAdLoading] = useState(false);

    if (!income) {
        // Direct access without starting the game -> back to intro.
        navigate("/budget-challenge", { replace: true });
        return null;
    }

    const totalAllocated = Object.values(allocations).reduce((a, b) => a + b, 0);

    function handleSlider(name, value) {
        setAllocations((prev) => ({ ...prev, [name]: parseInt(value, 10) }));
    }

    function checkBudget() {
        if (adLoading || getAdLoading()) return;
        if (totalAllocated > income) {
            showToast("Over budget! Reduce your spending.");
            return;
        }
        const needs = expenses.filter((e) => e.category === "needs").reduce((s, e) => s + (allocations[e.name] || 0), 0);
        const wants = expenses.filter((e) => e.category === "wants").reduce((s, e) => s + (allocations[e.name] || 0), 0);
        const savings = expenses.filter((e) => e.category === "savings").reduce((s, e) => s + (allocations[e.name] || 0), 0);
        const passed = needs <= income * 0.5 && wants <= income * 0.3 && savings >= income * 0.2;

        safeSetItem("budget_result", JSON.stringify({ income, needs, wants, savings, passed }));
        setAdLoading(true);
        showAdWithLogic(() => {
            setAdLoading(false);
            navigate("/budget-challenge-reward");
        });
    }

    function resetGame() {
        setAllocations({});
    }

    return (
        <PageShell>
            <PageHeader title="Budget Challenge" onBack={() => navigate("/budget-challenge")} />

            <AdBanner bannerId="gpt-banner-budget-play" placement="budget_challenge_play" containerId="adsense-container" />

            <div className="game_section" style={{ height: "auto" }}>
                <div>
                    <img src="/assets/robux/people-with-coins.png" className="rbximage" alt="Budget Game" />
                </div>
                <div>
                    <p className="countryP" style={{ fontSize: "16px" }}>
                        Page 2: Split your <b>₹{income.toLocaleString()}</b> income!
                    </p>

                    <p className="countryP">
                        Allocated: ₹{totalAllocated.toLocaleString()} / ₹{income.toLocaleString()}
                    </p>
                    <div className="quiz-progress-bar">
                        <div className="quiz-progress-fill" style={{ width: Math.min((totalAllocated / (income || 1)) * 100, 100) + "%" }}></div>
                    </div>

                    {expenses.map((exp) => (
                        <div key={exp.name} style={{ marginBottom: "10px" }}>
                            <p className="countryP" style={{ fontSize: "14px", marginBottom: "2px" }}>
                                {exp.name} <span style={{ color: exp.category === "needs" ? "#93c5fd" : exp.category === "wants" ? "#c084fc" : "#4ade80", fontSize: "11px" }}>[{exp.category}]</span>
                                {" "}- ₹{(allocations[exp.name] || 0).toLocaleString()}
                            </p>
                            <input
                                type="range" min="0" max={Math.round(income * 0.5)} step="500"
                                value={allocations[exp.name] || 0}
                                onChange={(e) => handleSlider(exp.name, e.target.value)}
                                style={{ width: "100%" }}
                            />
                        </div>
                    ))}

                    <br />
                    <button className="continue-btn" onClick={checkBudget} disabled={adLoading}>
                        {adLoading ? "Loading Ad... ⏳" : "Check Budget"}
                    </button>
                    <button className="continue-btn" onClick={resetGame} style={{ marginTop: "8px", background: "#334155" }}>Reset</button>
                </div>
            </div>
        </PageShell>
    );
}

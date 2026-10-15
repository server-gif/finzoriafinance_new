import { useState } from "react";
import PageShell from "../components/layout/PageShell.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import AdBanner from "../components/common/AdBanner.jsx";
import AboutSection from "../components/common/AboutSection.jsx";
import usePageTitle from "../hooks/usePageTitle.js";
import { calcSavingsGoal } from "../utils/calculations.js";

export default function SavingsGoalCalculator() {
    usePageTitle("Savings Goal");
    const [goal, setGoal] = useState("");
    const [daily, setDaily] = useState("");
    const [saved, setSaved] = useState("0");
    const [result, setResult] = useState("");
    const [visible, setVisible] = useState(false);

    function handleCount() {
        const res = calcSavingsGoal(goal, daily, saved);
        if (!res) { alert("Please enter valid positive numbers"); return; }
        if (res.days === 0) { setResult("🎉 Goal already reached!"); }
        else { setResult(`${res.days} days (≈ ${res.months} months) to reach your goal!`); }
        setVisible(true);
    }

    return (
        <PageShell>
            <PageHeader title="Savings Goal Planner" />

            <AdBanner bannerId="gpt-banner-savings" placement="savings_goal" containerId="adsense-container" />

            <div className="game_section" style={{ height: "auto" }}>
                <div>
                    <img src="/assets/robux/all_calimage.webp" className="rbximage" alt="Savings Goal" />
                </div>
                <div>
                    <input type="text" className="input-field" placeholder="Target Amount (₹)" value={goal} onChange={(e) => setGoal(e.target.value)} />
                    <input type="text" className="input-field" placeholder="Daily Savings (₹)" value={daily} onChange={(e) => setDaily(e.target.value)} />
                    <input type="text" className="input-field" placeholder="Already Saved (₹)" value={saved} onChange={(e) => setSaved(e.target.value)} />
                    <br />
                    <button className="continue-btn" onClick={handleCount}>Count Now</button>
                </div>
            </div>

            <div id="rbxbuilder" style={{ display: visible ? "block" : "none" }}>
                <div>Your savings timeline :</div>
                <div id="result" className="rbxresult">{result}</div>
            </div>
            <AboutSection />
        </PageShell>
    );
}

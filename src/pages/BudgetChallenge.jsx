import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/layout/PageShell.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import AdBanner from "../components/common/AdBanner.jsx";
import usePageTitle from "../hooks/usePageTitle.js";
import { showToast } from "../components/common/toast.js";
import { showAdWithLogic, getAdLoading } from "../services/analytics.js";
import { safeSetItem } from "../utils/storage.js";

// Budget Challenge — Page 1 of 3 (intro). Like the old multi-page games:
// each "Continue" click runs the ad logic, then navigates to the next page.
export default function BudgetChallenge() {
    usePageTitle("Budget Challenge");
    const navigate = useNavigate();
    const [income, setIncome] = useState(50000);
    const [adLoading, setAdLoading] = useState(false);

    function startGame() {
        if (adLoading || getAdLoading()) return;
        if (!income || income <= 0) {
            showToast("Enter your monthly income first!");
            return;
        }
        safeSetItem("budget_income", income);
        setAdLoading(true);
        showAdWithLogic(() => {
            setAdLoading(false);
            navigate("/budget-challenge-play");
        });
    }

    return (
        <PageShell>
            <PageHeader title="Budget Challenge" />

            <AdBanner bannerId="gpt-banner-budget" placement="budget_challenge" containerId="adsense-container" />

            <div className="game_section" style={{ height: "auto" }}>
                <div>
                    <img src="/assets/robux/people-with-coins.png" className="rbximage" alt="Budget Game" />
                </div>
                <div>
                    <p className="countryP" style={{ fontSize: "16px", marginBottom: "10px" }}>
                        🎯 <b>The 50 / 30 / 20 Rule:</b>
                    </p>
                    <p className="countryP" style={{ fontSize: "14px" }}>• 50% of income → Needs</p>
                    <p className="countryP" style={{ fontSize: "14px" }}>• 30% of income → Wants</p>
                    <p className="countryP" style={{ fontSize: "14px" }}>• 20% of income → Savings</p>

                    <input
                        type="text"
                        className="input-field"
                        placeholder="Monthly Income (₹)"
                        value={income}
                        onChange={(e) => setIncome(parseInt(e.target.value) || 0)}
                        style={{ marginTop: "14px" }}
                    />

                    <button className="continue-btn" onClick={startGame} disabled={adLoading}>
                        {adLoading ? "Loading Ad... ⏳" : "Start Challenge"}
                    </button>
                </div>
            </div>
        </PageShell>
    );
}

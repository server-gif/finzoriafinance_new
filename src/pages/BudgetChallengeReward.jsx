import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/layout/PageShell.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import AdBanner from "../components/common/AdBanner.jsx";
import usePageTitle from "../hooks/usePageTitle.js";
import useCoins from "../hooks/useCoins.js";
import { showToast } from "../components/common/toast.js";
import { showAdWithLogic, getAdLoading } from "../services/analytics.js";
import { safeGetItem } from "../utils/storage.js";

// Budget Challenge — Page 3 of 3 (result + reward claim).
// Claiming runs a rewarded ad, then adds coins, like the old games did.
export default function BudgetChallengeReward() {
    usePageTitle("Budget Challenge");
    const navigate = useNavigate();
    const { addCoins } = useCoins();
    const [adLoading, setAdLoading] = useState(false);
    const [claimed, setClaimed] = useState(false);

    const result = useMemo(() => {
        try {
            return JSON.parse(safeGetItem("budget_result"));
        } catch {
            return null;
        }
    }, []);

    if (!result || !result.income) {
        navigate("/budget-challenge", { replace: true });
        return null;
    }

    const { income, needs, wants, savings, passed } = result;
    const reward = passed ? 20 : 5;

    function claimReward() {
        if (adLoading || getAdLoading() || claimed) return;
        setAdLoading(true);
        showAdWithLogic((adResult) => {
            setAdLoading(false);
            if (adResult && adResult.breakStatus === "viewed") {
                addCoins(reward);
                setClaimed(true);
                showToast(`+${reward} Coins Added!`);
            } else {
                showToast("Ad not completed. Try again!");
            }
        });
    }

    function row(label, value, target, ok) {
        return (
            <p className="countryP" style={{ fontSize: "15px" }}>
                {label}: ₹{value.toLocaleString()} <span style={{ fontSize: "12px", color: "#a9bcd6" }}>(target {target})</span>{" "}
                <b style={{ color: ok ? "#4ade80" : "#f87171" }}>{ok ? "✔" : "✘"}</b>
            </p>
        );
    }

    return (
        <PageShell>
            <PageHeader title="Budget Challenge" onBack={() => navigate("/budget-challenge-play")} />

            <AdBanner bannerId="gpt-banner-budget-reward" placement="budget_challenge_reward" containerId="adsense-container" />

            <div className="game_section" style={{ height: "auto" }}>
                <div>
                    <img src="/assets/robux/people-with-coins.png" className="rbximage" alt="Budget Result" />
                </div>
                <div>
                    <p className="countryP" style={{ fontSize: "18px", marginBottom: "12px" }}>
                        {passed ? "🏆 Great budget! You're a Finance Master!" : "😅 Close! Keep practicing the 50/30/20 rule!"}
                    </p>

                    {row("Needs (≤50%)", needs, "≤ ₹" + Math.round(income * 0.5).toLocaleString(), needs <= income * 0.5)}
                    {row("Wants (≤30%)", wants, "≤ ₹" + Math.round(income * 0.3).toLocaleString(), wants <= income * 0.3)}
                    {row("Savings (≥20%)", savings, "≥ ₹" + Math.round(income * 0.2).toLocaleString(), savings >= income * 0.2)}

                    <p className="countryP" style={{ fontSize: "16px", marginTop: "12px" }}>
                        Reward: <b style={{ color: "#ff7f00" }}>{reward} Coins</b>
                    </p>

                    <button className="continue-btn" onClick={claimReward} disabled={adLoading || claimed}>
                        {claimed ? "Claimed ✔" : adLoading ? "Loading Ad... ⏳" : "Claim Reward"}
                    </button>
                    <button className="continue-btn" onClick={() => navigate("/home")} style={{ marginTop: "8px", background: "#334155" }}>
                        Back to Home
                    </button>
                </div>
            </div>
        </PageShell>
    );
}

import { useState } from "react";
import PageShell from "../components/layout/PageShell.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import AdBanner from "../components/common/AdBanner.jsx";
import usePageTitle from "../hooks/usePageTitle.js";

const TIPS = [
    { title: "Pay Yourself First", tip: "Before paying bills or spending, transfer 20% to savings/investments. Make saving automatic, not optional." },
    { title: "The 24-Hour Rule", tip: "Want to buy something non-essential? Wait 24 hours. If you still want it after a day, buy it. Most impulse urges fade." },
    { title: "Emergency Fund = Freedom", tip: "Keep 3-6 months of expenses in a liquid savings account. This prevents you from going into debt during unexpected events." },
    { title: "Compound Interest is Magic", tip: "₹5,000/month at 12% for 20 years = ₹4.9 Lakhs invested → ₹4.99 Lakhs in RETURNS alone. Start early!" },
    { title: "Avoid Lifestyle Inflation", tip: "When your income grows, keep expenses stable and invest the difference. Don't upgrade everything just because you can." },
    { title: "Cloud Cost Optimization", tip: "Right-size your instances, use spot instances for non-critical workloads, and set billing alerts to avoid surprise cloud bills." },
    { title: "The Latency-Money Tradeoff", tip: "In cloud, lower latency costs more (edge servers). Ask: does every user request really need a 10ms response, or will 50ms work?" },
    { title: "Serverless for Variable Load", tip: "If your app has unpredictable traffic, serverless (Lambda/Functions) can save 60-80% vs always-on VMs. You only pay per invocation." },
    { title: "Diversify Investments", tip: "Don't put all money in one asset class. Mix equity (growth), debt (stability), and gold (hedge) based on your risk capacity." },
    { title: "Track Your Subscriptions", tip: "List every recurring payment. Cancel unused ones. That forgotten free trial often becomes a ₹500/month leak." },
];

export default function FinanceTips() {
    usePageTitle("Finance Tips");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [revealed, setRevealed] = useState(false);

    function next() {
        setRevealed(false);
        setCurrentIndex((i) => (i + 1) % TIPS.length);
    }

    function prev() {
        setRevealed(false);
        setCurrentIndex((i) => (i - 1 + TIPS.length) % TIPS.length);
    }

    const card = TIPS[currentIndex];

    return (
        <PageShell>
            <PageHeader title="Daily Finance Tips" />

            <AdBanner bannerId="gpt-banner-tips" placement="finance_tips" containerId="adsense-container" />

            <div className="game_section" style={{ height: "auto" }}>
                <div>
                    <img src="/assets/robux/all_calimage.webp" className="rbximage" alt="Finance Tips" />
                </div>
                <div style={{ textAlign: "center" }}>
                    <p className="countryP">{currentIndex + 1} / {TIPS.length}</p>
                    <p className="rbxresult" style={{ fontSize: "20px", marginBottom: "10px" }}>{card.title}</p>

                    <div
                        onClick={() => setRevealed(!revealed)}
                        style={{ background: "#0f3460", borderRadius: "12px", padding: "20px", cursor: "pointer", marginBottom: "16px" }}
                    >
                        {revealed ? (
                            <p className="countryP" style={{ margin: 0 }}>{card.tip}</p>
                        ) : (
                            <p style={{ color: "#64748b", fontStyle: "italic" }}>Tap to reveal this tip...</p>
                        )}
                    </div>

                    <div className="click_btn_option">
                        <button className="click_btn" onClick={prev}>← Prev</button>
                        <button className="click_btn" onClick={next}>Next →</button>
                    </div>
                </div>
            </div>
        </PageShell>
    );
}

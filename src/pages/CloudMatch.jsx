import { useState } from "react";
import PageShell from "../components/layout/PageShell.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import AdBanner from "../components/common/AdBanner.jsx";
import usePageTitle from "../hooks/usePageTitle.js";
import { showToast } from "../components/common/toast.js";

const SERVICES = [
    { name: "EC2 / Compute Engine", category: "Compute" },
    { name: "S3 / Cloud Storage", category: "Storage" },
    { name: "RDS / Cloud SQL", category: "Database" },
    { name: "Lambda / Functions", category: "Compute" },
    { name: "VPC / Virtual Network", category: "Networking" },
    { name: "DynamoDB / Firestore", category: "Database" },
    { name: "EBS / Persistent Disk", category: "Storage" },
    { name: "Route 53 / Cloud DNS", category: "Networking" },
    { name: "EKS / GKE", category: "Compute" },
    { name: "CloudFront / CDN", category: "Networking" },
];

const CATEGORIES = ["Compute", "Storage", "Database", "Networking"];

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

export default function CloudMatch() {
    usePageTitle("Cloud Match Game");
    const [services] = useState(() => shuffle(SERVICES));
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [matched, setMatched] = useState(new Set());

    function handleMatch(serviceName, chosenCategory) {
        setAttempts((a) => a + 1);
        const service = SERVICES.find((s) => s.name === serviceName);
        if (service && service.category === chosenCategory) {
            setScore((s) => s + 1);
            setMatched((prev) => new Set([...prev, serviceName]));
            showToast("Correct! " + serviceName);
        } else {
            showToast("Wrong! Try again.");
        }
    }

    function resetGame() {
        setScore(0);
        setAttempts(0);
        setMatched(new Set());
    }

    const remaining = services.filter((s) => !matched.has(s.name));

    return (
        <PageShell>
            <PageHeader title="Cloud Match Game" />

            <AdBanner bannerId="gpt-banner-cloudmatch" placement="cloud_match" containerId="adsense-container" />

            <div className="game_section" style={{ height: "auto" }}>
                <div>
                    <img src="/assets/robux/all_calimage.webp" className="rbximage" alt="Cloud Match" />
                </div>

                <div style={{ textAlign: "center" }}>
                    <p className="countryP">
                        Score: {score} | Attempts: {attempts} | Left: {remaining.length}
                    </p>
                </div>

                {remaining.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "20px" }}>
                        <p className="rbxresult">All Matched! Accuracy: {attempts > 0 ? Math.round((score / attempts) * 100) : 0}%</p>
                        <button className="continue-btn" onClick={resetGame}>Play Again</button>
                    </div>
                ) : (
                    <div>
                        {remaining.map((svc) => (
                            <div key={svc.name} className="play_btn" style={{ margin: "8px 16px", padding: "12px" }}>
                                <p className="play_btn_txt">{svc.name}</p>
                                <div className="click_btn_option" style={{ marginTop: "8px" }}>
                                    {CATEGORIES.map((cat) => (
                                        <button key={cat} className="click_btn" style={{ fontSize: "12px", padding: "6px 12px" }} onClick={() => handleMatch(svc.name, cat)}>
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <button className="continue-btn" onClick={resetGame} style={{ margin: "10px 16px" }}>Reset</button>
                    </div>
                )}
            </div>
        </PageShell>
    );
}

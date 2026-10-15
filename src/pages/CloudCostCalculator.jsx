import { useState } from "react";
import PageShell from "../components/layout/PageShell.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import AdBanner from "../components/common/AdBanner.jsx";
import AboutSection from "../components/common/AboutSection.jsx";
import usePageTitle from "../hooks/usePageTitle.js";
import { calcCloudCost } from "../utils/calculations.js";

export default function CloudCostCalculator() {
    usePageTitle("Cloud Cost Calculator");
    const [instances, setInstances] = useState("2");
    const [hours, setHours] = useState("24");
    const [price, setPrice] = useState("0.05");
    const [storage, setStorage] = useState("100");
    const [result, setResult] = useState("");
    const [visible, setVisible] = useState(false);

    function handleCount() {
        const res = calcCloudCost(instances, hours, price, storage, 0.02);
        if (!res) { alert("Please enter valid positive numbers"); return; }
        setResult(`Compute: $${res.computeCost} + Storage: $${res.storageCost} = $${res.totalMonthly}/month`);
        setVisible(true);
    }

    return (
        <PageShell>
            <PageHeader title="Cloud Cost Estimator" />

            <AdBanner bannerId="gpt-banner-cloud" placement="cloud_cost" containerId="adsense-container" />

            <div className="game_section" style={{ height: "auto" }}>
                <div>
                    <img src="/assets/robux/people-working-on-data-management-illustration-svg-download-png-12141642.png" className="rbximage" alt="Cloud Cost" />
                </div>
                <div>
                    <input type="text" className="input-field" placeholder="Number of VM Instances" value={instances} onChange={(e) => setInstances(e.target.value)} />
                    <input type="text" className="input-field" placeholder="Running Hours per Day" value={hours} onChange={(e) => setHours(e.target.value)} />
                    <input type="text" className="input-field" placeholder="Price per Instance/Hour ($)" value={price} onChange={(e) => setPrice(e.target.value)} />
                    <input type="text" className="input-field" placeholder="Storage in GB" value={storage} onChange={(e) => setStorage(e.target.value)} />
                    <br />
                    <button className="continue-btn" onClick={handleCount}>Count Now</button>
                </div>
            </div>

            <div id="rbxbuilder" style={{ display: visible ? "block" : "none" }}>
                <div>Your estimated monthly cloud cost :</div>
                <div id="result" className="rbxresult">{result}</div>
            </div>
            <AboutSection />
        </PageShell>
    );
}

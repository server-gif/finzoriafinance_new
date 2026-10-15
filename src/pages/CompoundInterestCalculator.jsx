import { useState } from "react";
import PageShell from "../components/layout/PageShell.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import AdBanner from "../components/common/AdBanner.jsx";
import AboutSection from "../components/common/AboutSection.jsx";
import usePageTitle from "../hooks/usePageTitle.js";
import { calcCompoundInterest } from "../utils/calculations.js";

export default function CompoundInterestCalculator() {
    usePageTitle("Compound Interest");
    const [principal, setPrincipal] = useState("");
    const [rate, setRate] = useState("10");
    const [years, setYears] = useState("");
    const [freq, setFreq] = useState("12");
    const [result, setResult] = useState("");
    const [visible, setVisible] = useState(false);

    function handleCount() {
        const res = calcCompoundInterest(principal, rate, years, freq);
        if (!res) { alert("Please enter valid positive numbers"); return; }
        setResult(`Interest: ₹${res.ci.toLocaleString()} | Total Amount: ₹${res.amount.toLocaleString()}`);
        setVisible(true);
    }

    return (
        <PageShell>
            <PageHeader title="Compound Interest" />

            <AdBanner bannerId="gpt-banner-ci" placement="compound_interest" containerId="adsense-container" />

            <div className="game_section" style={{ height: "auto" }}>
                <div>
                    <img src="/assets/robux/all_calimage.webp" className="rbximage" alt="Compound Interest" />
                </div>
                <div>
                    <input type="text" className="input-field" placeholder="Principal Amount (₹)" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
                    <input type="text" className="input-field" placeholder="Annual Rate % (e.g. 10)" value={rate} onChange={(e) => setRate(e.target.value)} />
                    <input type="text" className="input-field" placeholder="Time in Years (e.g. 5)" value={years} onChange={(e) => setYears(e.target.value)} />
                    <select className="input-field" value={freq} onChange={(e) => setFreq(e.target.value)}>
                        <option value="1">Yearly</option>
                        <option value="4">Quarterly</option>
                        <option value="12">Monthly</option>
                        <option value="365">Daily</option>
                    </select>
                    <br />
                    <button className="continue-btn" onClick={handleCount}>Count Now</button>
                </div>
            </div>

            <div id="rbxbuilder" style={{ display: visible ? "block" : "none" }}>
                <div>After compounding, You will get :</div>
                <div id="result" className="rbxresult">{result}</div>
            </div>
            <AboutSection />
        </PageShell>
    );
}

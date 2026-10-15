import { useState } from "react";
import PageShell from "../components/layout/PageShell.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import AdBanner from "../components/common/AdBanner.jsx";
import AboutSection from "../components/common/AboutSection.jsx";
import usePageTitle from "../hooks/usePageTitle.js";
import { calcSIP } from "../utils/calculations.js";

export default function SipCalculator() {
    usePageTitle("SIP Calculator");
    const [monthly, setMonthly] = useState("");
    const [rate, setRate] = useState("12");
    const [years, setYears] = useState("");
    const [result, setResult] = useState("");
    const [visible, setVisible] = useState(false);

    function handleCount() {
        const res = calcSIP(monthly, rate, years);
        if (!res) { alert("Please enter valid positive numbers"); return; }
        setResult(`Invested: ₹${res.invested.toLocaleString()} | Returns: ₹${res.gains.toLocaleString()} | Total: ₹${res.fv.toLocaleString()}`);
        setVisible(true);
    }

    return (
        <PageShell>
            <PageHeader title="SIP Calculator" />

            <AdBanner bannerId="gpt-banner-sip" placement="sip_calculator" containerId="adsense-container" />

            <div className="game_section" style={{ height: "auto" }}>
                <div>
                    <img src="/assets/robux/sip-calc-icon.png" className="rbximage" alt="SIP Calculator" />
                </div>
                <div>
                    <input type="text" className="input-field" placeholder="Monthly Investment (₹)" value={monthly} onChange={(e) => setMonthly(e.target.value)} />
                    <input type="text" className="input-field" placeholder="Annual Return % (e.g. 12)" value={rate} onChange={(e) => setRate(e.target.value)} />
                    <input type="text" className="input-field" placeholder="Years (e.g. 10)" value={years} onChange={(e) => setYears(e.target.value)} />
                    <br />
                    <button className="continue-btn" onClick={handleCount}>Count Now</button>
                </div>
            </div>

            <div id="rbxbuilder" style={{ display: visible ? "block" : "none" }}>
                <div>If You invest every month, You will get :</div>
                <div id="result" className="rbxresult">{result}</div>
            </div>
            <AboutSection />
        </PageShell>
    );
}

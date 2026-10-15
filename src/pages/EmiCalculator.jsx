import { useState } from "react";
import PageShell from "../components/layout/PageShell.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import AdBanner from "../components/common/AdBanner.jsx";
import AboutSection from "../components/common/AboutSection.jsx";
import usePageTitle from "../hooks/usePageTitle.js";
import { calcEMI } from "../utils/calculations.js";

export default function EmiCalculator() {
    usePageTitle("EMI Calculator");
    const [loan, setLoan] = useState("");
    const [rate, setRate] = useState("8.5");
    const [tenure, setTenure] = useState("");
    const [result, setResult] = useState("");
    const [visible, setVisible] = useState(false);

    function handleCount() {
        const res = calcEMI(loan, rate, tenure);
        if (!res) { alert("Please enter valid positive numbers"); return; }
        setResult(`EMI: ₹${res.emi.toLocaleString()} | Interest: ₹${res.totalInterest.toLocaleString()} | Total: ₹${res.totalPayment.toLocaleString()}`);
        setVisible(true);
    }

    return (
        <PageShell>
            <PageHeader title="EMI Calculator" />

            <AdBanner bannerId="gpt-banner-emi" placement="emi_calculator" containerId="adsense-container" />

            <div className="game_section" style={{ height: "auto" }}>
                <div>
                    <img src="/assets/robux/monthly-loan-payment.png" className="rbximage" alt="EMI Calculator" />
                </div>
                <div>
                    <input type="text" className="input-field" placeholder="Loan Amount (₹)" value={loan} onChange={(e) => setLoan(e.target.value)} />
                    <input type="text" className="input-field" placeholder="Interest Rate % (e.g. 8.5)" value={rate} onChange={(e) => setRate(e.target.value)} />
                    <input type="text" className="input-field" placeholder="Tenure in Months (e.g. 60)" value={tenure} onChange={(e) => setTenure(e.target.value)} />
                    <br />
                    <button className="continue-btn" onClick={handleCount}>Count Now</button>
                </div>
            </div>

            <div id="rbxbuilder" style={{ display: visible ? "block" : "none" }}>
                <div>Your Loan EMI will be :</div>
                <div id="result" className="rbxresult">{result}</div>
            </div>
            <AboutSection />
        </PageShell>
    );
}

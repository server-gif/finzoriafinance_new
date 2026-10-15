import { useRef, useState } from "react";
import AdBanner from "../common/AdBanner.jsx";

// Shared form used by the 5 calculators (dollar-rbx, rbx-dollar, bc/tbc/obc counters).
// Behavior mirrors the original inline script: read the input, run `compute` (returns a
// formatted string or null when invalid), alert on invalid, otherwise reveal #rbxbuilder.
export default function SimpleCalculator({
    placeholder,
    alertMessage,
    compute,
    resultLabel,
    bannerId,
    bannerPlacement,
}) {
    const inputRef = useRef(null);
    const [result, setResult] = useState("");
    const [visible, setVisible] = useState(false);

    function handleCount() {
        const out = compute(inputRef.current.value);
        if (out === null || out === undefined) {
            // eslint-disable-next-line no-alert
            alert(alertMessage);
            return;
        }
        setResult(out);
        setVisible(true);
    }

    return (
        <>
            <div className="game_section" style={{ height: "auto" }}>
                <div>
                    <img src="/assets/robux/all_calimage.webp" className="rbximage" alt="Rbux Counter" />
                </div>
                <div>
                    <input type="text" className="input-field" id="playerNameInput" placeholder={placeholder} ref={inputRef} />
                    <br />
                    <button className="continue-btn" id="continueBtn" onClick={handleCount}>Count Now</button>
                </div>
            </div>

            <div id="rbxbuilder" style={{ display: visible ? "block" : "none" }}>
                <div>{resultLabel}</div>
                <div id="result" className="rbxresult">{result}</div>
            </div>

            <AdBanner bannerId={bannerId} placement={bannerPlacement} containerId="adsense-container" />
        </>
    );
}

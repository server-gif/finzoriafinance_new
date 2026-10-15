import { useState } from "react";
import { createPortal } from "react-dom";
import { showAdWithLogic } from "../../services/analytics.js";
import { showErrorToast } from "../common/toast.js";

// React port of home.html's showOopsPopup(). Same markup/classes and the same ad flow:
// "Watch Video" runs a rewarded ad; on 'viewed' we go to the pending game, otherwise an
// error toast is shown and the popup just closes. "close" cancels the pending redirect.
export default function OopsPopup({ open, gameUrl, onClose, navigate }) {
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    function handleWatch() {
        if (loading) return;
        setLoading(true);
        showAdWithLogic((result) => {
            if (result && result.breakStatus === "viewed") {
                if (gameUrl) setTimeout(() => navigate(gameUrl), 100);
            } else {
                showErrorToast();
            }
            setLoading(false);
            onClose();
        });
    }

    function handleClose() {
        onClose();
    }

    // Rendered into document.body via a portal, exactly like the original showOopsPopup()
    // which appended the popup to <body>. This keeps the position:fixed overlay centered
    // over the viewport regardless of any ancestor styling inside the page shell.
    return createPortal(
        <div id="oopsPopup" className="popup" style={{ display: "flex" }} data-clarity-mask="true">
            <div className="popup-data">
                <img className="oops-img" src="/assets/icons/oops.png" alt="Oops!" />
                <p className="main-text">You don't have enough coins to join this contest.</p>
                <p className="sub-text">Watch an ad to earn free coins</p>
                <div className="watch-btn-wrapper">
                    <button id="watchAdBtn" className="watch-btn shimmer-btn" disabled={loading} onClick={handleWatch}>
                        {loading ? "Loading Ad... ⏳" : "Watch Video"}
                    </button>
                    <span className="ad-tag">Ad</span>
                </div>
                <button id="skipBtn" className="skip-btn" disabled={loading} onClick={handleClose}>close</button>
            </div>
        </div>,
        document.body
    );
}

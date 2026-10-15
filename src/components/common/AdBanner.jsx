import { useEffect } from "react";
import Ads from "../../services/ads.js";

// Replaces the per-page `<div class="gadsbanner"><div id="gpt-banner-..."></div><script>Ads.banner(...)</script></div>`
// pattern. Initializes the GPT slot after the div exists and destroys it on unmount so SPA
// navigation never re-defines the same slot twice (no duplicate slots / leaks).
export default function AdBanner({ bannerId, placement, containerId }) {
    useEffect(() => {
        Ads.banner(bannerId, placement);
        return () => {
            Ads.removeBanner(bannerId);
        };
    }, [bannerId, placement]);

    return (
        <div className="gadsbanner" id={containerId}>
            <div id={bannerId} className="gpt-banner"></div>
        </div>
    );
}

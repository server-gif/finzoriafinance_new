import { useState } from "react";
import PageShell from "../components/layout/PageShell.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import AdBanner from "../components/common/AdBanner.jsx";
import SmartLink from "../components/common/SmartLink.jsx";
import usePageTitle from "../hooks/usePageTitle.js";

// Skin active page (skinactive.html). "Activate" opens the congrats dialog; the OK button
// is an `.earnCoinSection` link to home, so it runs the reward-ad branch first.
export default function SkinActive() {
    usePageTitle("FF Skin Tool");
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <PageShell>
            <PageHeader title="FF Skin Tool" />

            <AdBanner bannerId="gpt-banner-skinactive" placement="skinactive" containerId="adsense-container" />

            <img src="/assets/robux/favskin1.webp" alt="Rbux Skin" style={{ width: "70%" }} />

            <div className="contentButton">
                <p className="countryP">This Roblox avatar features a stylish look with a black hoodie branded with
                    “ROBLOX” paired with ripped black jeans and trendy sneakers. The spiky black hairstyle with
                    a red headband adds a bold touch. Perfect for casual yet cool gameplay, this character
                    stands out with confidence and modern streetwear vibes.</p>
                <img
                    src="/assets/robux/skiff_activebtn.png"
                    className="imgActivate"
                    id="openDialog"
                    alt="Activate"
                    style={{cursor:"pointer" }}
                    onClick={() => setDialogOpen(true)}
                />
            </div>

            <div id="dialogBox" className={"dialog-overlay" + (dialogOpen ? "" : " hidden")}>
                <div className="dialog-box">
                    <img src="/assets/robux/skiff_cong.webp" alt="Party Icon" className="dialog-icon" />
                    <h2>Congratulation</h2>
                    <p className="countryP">Your Finance Skin will be added to your Collections within 24 hours.</p>
                    <div className="earnCoinSection">
                        <SmartLink href="home.html">
                            <img src="/assets/robux/skiff_okbtn.png" className="dialog-button" alt="OK" />
                        </SmartLink>
                    </div>
                </div>
            </div>
        </PageShell>
    );
}

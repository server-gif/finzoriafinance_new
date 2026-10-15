import PageShell from "../components/layout/PageShell.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import AdBanner from "../components/common/AdBanner.jsx";
import SmartLink from "../components/common/SmartLink.jsx";
import AboutSection from "../components/common/AboutSection.jsx";
import usePageTitle from "../hooks/usePageTitle.js";

// Daily Free Rbx Calculator (daily-free-rbx-cal.html). Cards sit inside `.rewards`,
// so each click runs the reward-ad branch before navigating to the counter page.
export default function DailyFreeRbxCalculator() {
    usePageTitle("Free Savings Calculator");
    return (
        <PageShell>
            <PageHeader title="Daily Free Savings Calculator" />

            <AdBanner bannerId="gpt-banner-daily-free-rbx-cal" placement="daily_free_rbx_cal" containerId="adsense-container" />

            <div className="game_section" style={{ height: "auto" }}>
                <div className="rewards">
                    <SmartLink href="bc-rbx-counter.html">
                        <img src="/assets/robux/bc.webp" className="homeimage" alt="Rbux Counter" />
                    </SmartLink>
                </div>
            </div>

            <div className="game_section" style={{ height: "auto" }}>
                <div className="rewards">
                    <SmartLink href="tbc-rbx-counter.html">
                        <img src="/assets/robux/tbc.webp" className="homeimage" alt="Rbux Counter" />
                    </SmartLink>
                </div>
                <div className="rewards">
                    <SmartLink href="obc-rbx-counter.html">
                        <img src="/assets/robux/obc.webp" className="homeimage" alt="Rbux Counter" />
                    </SmartLink>
                </div>
            </div>

            <AboutSection />
        </PageShell>
    );
}

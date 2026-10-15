import PageShell from "../components/layout/PageShell.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import AdBanner from "../components/common/AdBanner.jsx";
import GameCard from "../components/common/GameCard.jsx";
import AboutSection from "../components/common/AboutSection.jsx";
import usePageTitle from "../hooks/usePageTitle.js";

// Daily R$ Converter hub (daily-r-converter.html): links to the finance calculators.
export default function DailyRConverter() {
    usePageTitle("Daily Savings Converter");
    return (
        <PageShell>
            <PageHeader title="Daily Savings Converter" />

            <AdBanner bannerId="gpt-banner-daily-r-converter" placement="daily_r_converter" containerId="adsense-container" />

            <div className="game_section" style={{ height: "auto" }}>
                <div className="game_section1">
                    <GameCard href="daily-free-rbx-cal.html" img="/assets/robux/routine_image.webp" />
                    <GameCard href="rbx-dollar-cal.html" img="/assets/robux/dollar_image.webp" />
                </div>
            </div>

            <div className="game_section" style={{ height: "auto" }}>
                <div className="game_section1">
                    <GameCard href="dollar-rbx-cal.html" img="/assets/robux/rbx_image.webp" />
                </div>
            </div>

            <AboutSection />
        </PageShell>
    );
}

import PageShell from "../components/layout/PageShell.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import AdBanner from "../components/common/AdBanner.jsx";
import GameCard from "../components/common/GameCard.jsx";
import usePageTitle from "../hooks/usePageTitle.js";

const TOP = ["neon_jeans.png", "girltshirt.png"];
const BOTTOM = ["boytshirt.png", "hoodie.png", "shortcoat.png", "longcoat.png"];

// Clothes selection grid (clothes.html). All cards link to the anime page.
export default function Clothes() {
    usePageTitle("FF Skin Tool: Rewards");
    return (
        <PageShell>
            <PageHeader title="Select Clothes" />

            <AdBanner bannerId="gpt-banner-clothes" placement="clothes" containerId="adsense-container" />

            <div className="game_section" style={{ height: "auto" }}>
                <div className="game_section1">
                    {TOP.map((img) => (
                        <GameCard key={img} href="anime.html" img={`/assets/robux/${img}`} />
                    ))}
                </div>
            </div>

            <div className="game_section" style={{ height: "auto" }}>
                <div className="game_section1">
                    {BOTTOM.map((img) => (
                        <GameCard key={img} href="anime.html" img={`/assets/robux/${img}`} />
                    ))}
                </div>
            </div>
        </PageShell>
    );
}

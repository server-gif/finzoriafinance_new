import PageShell from "../components/layout/PageShell.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import AdBanner from "../components/common/AdBanner.jsx";
import GameCard from "../components/common/GameCard.jsx";
import usePageTitle from "../hooks/usePageTitle.js";

const TOP = ["favskin1.png", "favskin2.png"];
const BOTTOM = ["favskin3.png", "favskin4.png", "favskin5.png", "favskin6.png"];

// Favourite-skin grid (skin.html). All cards link to the skin-active page.
export default function Skin() {
    usePageTitle("FF Skin Tool: Favourite Skin");
    return (
        <PageShell>
            <PageHeader title="Choose Your Favourite Skin :" />

            <AdBanner bannerId="gpt-banner-skin" placement="skin" containerId="adsense-container" />

            <div className="game_section" style={{ height: "auto" }}>
                <div className="game_section1">
                    {TOP.map((img) => (
                        <GameCard key={img} href="skinactive.html" img={`/assets/robux/${img}`} />
                    ))}
                </div>
            </div>

            <div className="game_section" style={{ height: "auto" }}>
                <div className="game_section1">
                    {BOTTOM.map((img) => (
                        <GameCard key={img} href="skinactive.html" img={`/assets/robux/${img}`} />
                    ))}
                </div>
            </div>
        </PageShell>
    );
}

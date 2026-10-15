import PageShell from "../components/layout/PageShell.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import AdBanner from "../components/common/AdBanner.jsx";
import SmartLink from "../components/common/SmartLink.jsx";
import usePageTitle from "../hooks/usePageTitle.js";

const TOP = ["anime1.png", "anime2.png"];
const BOTTOM = ["anime3.png", "anime4.png", "anime5.png", "anime6.png", "anime7.png"];

// Anime selection grid (anime.html). Every card is inside `.rewards`, so clicks run the
// reward-ad branch before navigating to the skin page.
export default function Anime() {
    usePageTitle("FF Skin Tool : Anime");
    return (
        <PageShell>
            <PageHeader title="Select Anime" />

            <AdBanner bannerId="gpt-banner-anime" placement="anime" containerId="adsense-container" />

            <div className="game_section" style={{ height: "auto" }}>
                {TOP.map((img) => (
                    <div className="animesec rewards" key={img}>
                        <SmartLink href="skin.html">
                            <img src={`/assets/robux/${img}`} className="homeimage" alt="Rbux Counter" />
                        </SmartLink>
                    </div>
                ))}
            </div>

            <div className="game_section" style={{ height: "auto" }}>
                {BOTTOM.map((img) => (
                    <div className="animesec rewards" key={img}>
                        <SmartLink href="skin.html">
                            <img src={`/assets/robux/${img}`} className="homeimage" alt="Rbux Counter" />
                        </SmartLink>
                    </div>
                ))}
            </div>
        </PageShell>
    );
}

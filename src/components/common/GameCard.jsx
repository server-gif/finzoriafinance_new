import SmartLink from "./SmartLink.jsx";

// The repeated "picture card" grid item:
// <div class="game_section2"><a class="game_section3"><div class="game_section4"><picture><img></picture></div></a></div>
// Used by clothes, skin, daily-r-converter and the home reward cards. `wrapperClass` lets a page
// add the extra classes it used (e.g. "game_section2 rewards earnCoin_section2").
export default function GameCard({ href, img, alt = "Rbux Counter", wrapperClass = "game_section2", onClick }) {
    return (
        <div className={wrapperClass} onClick={onClick}>
            <SmartLink href={href} className="game_section3">
                <div className="game_section4">
                    <picture>
                        <img src={img} alt={alt} loading="eager" className="game_section_img" />
                    </picture>
                </div>
            </SmartLink>
        </div>
    );
}

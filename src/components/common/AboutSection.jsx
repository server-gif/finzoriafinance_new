import SmartLink from "../common/SmartLink.jsx";

// The "about / features / disclaimer" block repeated verbatim on several pages.
// Markup and copy are preserved exactly; the external reference link keeps the
// same ad-gated behavior through SmartLink.
export default function AboutSection() {
    return (
        <div className="resp_about_section">
            <div className="about_section">
                <h1>FF Skin Tool – Learn Money and Cloud the Fun Way!</h1>

                <p>
                    Calculate your daily savings, convert money into rewards, and learn the
                    basics of personal finance and cloud computing with easy, fun tools.
                </p>

                <h1>Features</h1>
                <ul>
                    <li>Finance &amp; RBX calculators and converters</li>
                    <li>Daily savings and subscription planners</li>
                    <li>Cloud computing and money quizzes</li>
                    <li>Spin &amp; Win – Spin the wheel of financial wisdom</li>
                    <li>Lucky Scratch – Scratch, reveal and learn</li>
                    <li>Finance &amp; cloud memes to brighten your day</li>
                </ul>

                <h1>Important Information</h1>
                <p>
                    FF Skin Tool is an unofficial educational app and is not affiliated with
                    any bank, stock exchange or cloud service provider. The numbers shown here
                    are simple estimates for learning and entertainment only and are not
                    financial or investment advice.
                </p>

                <h1>Refer to</h1>
                <p>
                    The name, logo and information provided by the application used in accordance
                    with the guidelines indicated in:
                </p>
                {/* <p>
                    <SmartLink
                        href="https://en.help.roblox.com/hc/en-us/articles/115001708126-Roblox-Name-and-Logo-Community-Usage-Guidelines"
                        target="_blank"
                    >
                        https://en.help.roblox.com/hc/en-us/articles/115001708126-Roblox-Name-and-Logo-Community-Usage-Guidelines
                    </SmartLink>
                </p> */}
                <p>Thank you!</p>
            </div>
        </div>
    );
}

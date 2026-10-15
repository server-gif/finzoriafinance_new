import PageShell from "../components/layout/PageShell.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import AdBanner from "../components/common/AdBanner.jsx";
import MemeCard from "../components/feature/MemeCard.jsx";
import usePageTitle from "../hooks/usePageTitle.js";

const GROUP_TOP = [
    { t: "Salary Day 😍➡️😭", b: <>Money arrives on the 1st… and disappears before the 5th</> },
    { t: "Cloud Ate My Homework", b: <>"It's saved in the cloud" — the cloud that has its own plans</> },
];
const GROUP_2 = [
    { t: "Compound Interest Magic ✨💸", b: <>Me: I'll start investing next month.<br />Next month: Me again</> },
    { t: "Budget Plan 💳💭", b: <>Me making a budget: 0 for fun. Me one hour later: added cart anyway</> },
    { t: "Bank Balance Check 👀", b: <>That paranoid feeling when you refresh your balance twice to be sure</> },
    { t: "Free Trial 🤡📅", b: <>"I'll cancel before renewal" — the cloud remembers me 30 days later</> },
];
const GROUP_3 = [
    { t: "Tried to Save…", b: <>I saved $5. The inflation waved and exploded it. Classic finance</> },
    { t: "99% Noobs in Server 🤯🍼", b: <>My cloud upload at 1%. Chaos. Pure chaos. And I'm the king of it.</> },
    { t: "That Tryhard Investor 🎯💪", b: <>Me: parking money in FD.<br />Him: trading like it's an e-sport.</> },
    { t: "Finally Got a Raise 🤢🧍", b: <>Me: Time to flex.<br />EMIs: Bro, we spent it all before you got it?</> },
];
const GROUP_4 = [
    { t: "Backup Saves All 💾🕺", b: <>Don't judge a noob by its hairstyle, judge a dev by its backup</> },
    { t: "Accidentally Hit Reset", b: <>Well, there goes my progress, my data and my pride</> },
    { t: "Premium Plan, Still Lost 💳😵", b: <>Paid for cloud storage just to lose the password 10 seconds in</> },
    { t: "Mom Took the PC 💻🚫", b: <>Just reached my savings goal… and now I'm logged out</> },
];
const GROUP_5 = [
    { t: "Friendly Fire in Finance 🤜😡", b: <>Bro we're on the same team! gets taxed anyway</> },
    { t: "Invisible Admin Pranks", b: <>Strange things are happening with my cloud files... I smell a sync glitch.</> },
    { t: "Scammer Deal Fail 🧢📦", b: <>"Trust me bro" = last words before the portfolio got wiped.</> },
    { t: "Tax Season = Pain", b: <>My fingers hurt. My soul hurts. My CA hurts. Worth it.</> },
];
const GROUP_6 = [
    { t: "Double Your Money Scam Again 🧠❌", b: <>Fool me once, shame on you. Fool me twice, still no returns.</> },
    { t: "Server at 3AM 🏗🌙", b: <>One more deploy. Just one more. It's already morning and the cloud is billing me?</> },
];

function renderGroup(items) {
    return items.map((m) => (
        <MemeCard key={m.t} title={m.t}>{m.b}</MemeCard>
    ));
}

// Memes page (meme.html). Cards grouped exactly as the original, banner between the first two groups.
export default function Meme() {
    usePageTitle("Memes For Fun");
    return (
        <PageShell>
            <PageHeader title="Memes For Fun" />

            <AdBanner bannerId="gpt-banner-meme" placement="meme" containerId="adsense-container" />

            <div className="game_section" style={{ height: "auto" }}>{renderGroup(GROUP_TOP)}</div>

            <div className="game_section" style={{ height: "auto" }}>{renderGroup(GROUP_2)}</div>
            <div className="game_section" style={{ height: "auto" }}>{renderGroup(GROUP_3)}</div>
            <div className="game_section" style={{ height: "auto" }}>{renderGroup(GROUP_4)}</div>
            <div className="game_section" style={{ height: "auto" }}>{renderGroup(GROUP_5)}</div>
            <div className="game_section" style={{ height: "auto" }}>{renderGroup(GROUP_6)}</div>
        </PageShell>
    );
}

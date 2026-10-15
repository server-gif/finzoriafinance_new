import { useState } from "react";
import PageShell from "../components/layout/PageShell.jsx";
import AdBanner from "../components/common/AdBanner.jsx";
import AboutSection from "../components/common/AboutSection.jsx";
import SmartLink from "../components/common/SmartLink.jsx";
import usePageTitle from "../hooks/usePageTitle.js";

// Landing page (index.html): banner + a 2-question mini quiz (finance + cloud) + "Let's Start Now" + about text.
const MINI_QUIZ = [
    { question: "Which finance concept means earning returns on both the original amount and its accumulated returns?", options: ["Compound Interest", "Inflation", "Depreciation", "Tax"], answer: 0 },
    { question: "In technology, what does 'cloud' refer to?", options: ["Weather forecasting", "Internet-based servers and storage", "A photo editing filter", "A type of computer mouse"], answer: 1 },
];

export default function Index() {
    usePageTitle("FF Skin Tool");

    const [qIndex, setQIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [showContinue, setShowContinue] = useState(false);
    const q = MINI_QUIZ[qIndex];

    function selectOption(i) {
        if (selected !== null) return;
        setSelected(i);
        setTimeout(() => {
            if (qIndex < MINI_QUIZ.length - 1) {
                setQIndex((v) => v + 1);
                setSelected(null);
            } else {
                setShowContinue(true);
            }
        }, 600);
    }

    function optionClass(i) {
        if (selected === null) return "quiz-option";
        if (i === q.answer) return "quiz-option correct";
        if (i === selected) return "quiz-option wrong";
        return "quiz-option";
    }

    return (
        <PageShell>
            <AdBanner bannerId="gpt-banner-index" placement="index" containerId="adsense-container" />

            <div className="game_section" style={{ height: "auto" }}>
                <div className="quiz-question-card" id="miniQuizCard">
                    <h3 id="miniQuizQuestion">{q.question}</h3>
                    <div className="quiz-options" id="miniQuizOptions">
                        {q.options.map((opt, i) => (
                            <button key={i} className={optionClass(i)} disabled={selected !== null} onClick={() => selectOption(i)}>
                                {opt}
                            </button>
                        ))}
                    </div>
                    <SmartLink href="home.html" className={"quiz-continue-btn" + (showContinue ? " visible" : "")} id="miniQuizContinueBtn">
                        Continue
                    </SmartLink>
                </div>
            </div>

            <div className="game_section" style={{ height: "auto" }}>
                <SmartLink href="home.html" className="lets-start-btn">
                    Let's Start Now
                </SmartLink>
            </div>

            <AboutSection />
        </PageShell>
    );
}

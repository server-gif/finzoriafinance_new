import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/layout/PageShell.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import AdBanner from "../components/common/AdBanner.jsx";
import usePageTitle from "../hooks/usePageTitle.js";

// Finance & Cloud Quiz (quiz.html): loads data/quizzes.json, list -> play -> result.
// All state transitions mirror the original classList toggles (hidden / active).
export default function Quiz() {
    usePageTitle("Finance & Cloud Quiz");
    const navigate = useNavigate();

    const [quizzes, setQuizzes] = useState([]);
    const [status, setStatus] = useState("loading"); // loading | ready | error
    const [view, setView] = useState("list");        // list | play | result
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [qIndex, setQIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [correctCount, setCorrectCount] = useState(0);

    useEffect(() => {
        fetch("/data/quizzes.json")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load quizzes");
                return res.json();
            })
            .then((data) => {
                setQuizzes(data.quizzes || []);
                setStatus("ready");
            })
            .catch(() => setStatus("error"));
    }, []);

    function startQuiz(quiz) {
        setCurrentQuiz(quiz);
        setQIndex(0);
        setSelected(null);
        setCorrectCount(0);
        setView("play");
    }

    function selectOption(i) {
        if (selected !== null) return;
        setSelected(i);
        if (i === currentQuiz.questions[qIndex].answer) {
            setCorrectCount((c) => c + 1);
        }
    }

    function optionClass(i) {
        const answer = currentQuiz.questions[qIndex].answer;
        let cls = "quiz-option";
        if (selected !== null) {
            if (i === answer) cls += " correct";
            else if (i === selected) cls += " wrong";
        }
        return cls;
    }

    function handleNext() {
        if (qIndex < currentQuiz.questions.length - 1) {
            setQIndex((v) => v + 1);
            setSelected(null);
        } else {
            setView("result");
        }
    }

    function retry() {
        setQIndex(0);
        setSelected(null);
        setCorrectCount(0);
        setView("play");
    }

    function showList() {
        setCurrentQuiz(null);
        setView("list");
    }

    function handleBack() {
        if (currentQuiz) showList();
        else navigate(-1);
    }

    const total = currentQuiz ? currentQuiz.questions.length : 0;
    const question = currentQuiz ? currentQuiz.questions[qIndex] : null;
    const progressPercent = currentQuiz ? (qIndex / total) * 100 : 0;

    let resultMessage = "";
    if (view === "result") {
        const percent = Math.round((correctCount / total) * 100);
        if (percent === 100) resultMessage = "Perfect score! You know your stuff.";
        else if (percent >= 60) resultMessage = "Nice work! Keep it up.";
        else resultMessage = "Give it another shot and see if you can improve!";
    }

    return (
        <PageShell>
            <PageHeader title={currentQuiz ? currentQuiz.title : "Quizzes"} onBack={handleBack} />

            <AdBanner bannerId="gpt-banner-quiz" placement="quiz" containerId="adsense-container" />

            <div className="game_section" style={{ height: "auto" }}>
                <div className={"quiz-list" + (view !== "list" ? " hidden" : "")} id="quizList">
                    {status === "loading" && <div className="quiz-loading">Loading quizzes...</div>}
                    {status === "error" && <div className="quiz-error">Could not load quizzes. Please try again later.</div>}
                    {status === "ready" && quizzes.length === 0 && <div className="quiz-error">No quizzes available right now.</div>}
                    {status === "ready" && quizzes.map((quiz, index) => (
                        <div className="quiz-card" key={quiz.id || index} onClick={() => startQuiz(quiz)}>
                            <img className="quiz-card-icon" src={"/" + (quiz.icon || "assets/robux/quiz_cup.webp").replace(/^\//, "")} alt={quiz.title} />
                            <div className="quiz-card-info">
                                <h3>{quiz.title}</h3>
                                <p>{quiz.description || ""}</p>
                            </div>
                            <span className="quiz-card-arrow">&#8250;</span>
                        </div>
                    ))}
                </div>

                <div className={"quiz-play" + (view === "play" ? " active" : "")} id="quizPlay">
                    <div className="quiz-progress-bar">
                        <div className="quiz-progress-fill" id="quizProgressFill" style={{ width: progressPercent + "%" }}></div>
                    </div>
                    <div className="quiz-progress-text" id="quizProgressText">
                        {question ? `Question ${qIndex + 1} of ${total}` : ""}
                    </div>

                    <div className="quiz-question-card">
                        <h3 id="quizQuestionText">{question ? question.question : ""}</h3>
                        <div className="quiz-options" id="quizOptions">
                            {question && question.options.map((opt, i) => (
                                <button key={i} className={optionClass(i)} disabled={selected !== null} onClick={() => selectOption(i)}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="quiz-nav">
                        <button id="quizNextBtn" disabled={selected === null} onClick={handleNext}>
                            {question && qIndex === total - 1 ? "Finish" : "Next"}
                        </button>
                    </div>
                </div>

                <div className={"quiz-result" + (view === "result" ? "" : " hidden")} id="quizResult">
                    <h2 id="quizResultTitle">{currentQuiz ? `${currentQuiz.title} Complete!` : ""}</h2>
                    <div className="quiz-score" id="quizScore">{`${correctCount} / ${total}`}</div>
                    <p id="quizScoreText">{resultMessage}</p>
                    <div className="quiz-result-actions">
                        <button className="quiz-retry-btn" id="quizRetryBtn" onClick={retry}>Retry</button>
                        <button className="quiz-back-btn" id="quizBackToListBtn" onClick={showList}>All Quizzes</button>
                    </div>
                </div>
            </div>
        </PageShell>
    );
}

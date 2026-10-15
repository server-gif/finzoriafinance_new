import { useNavigate } from "react-router-dom";

// Back-button + title header. The back image originally called window.history.back().
export default function PageHeader({ title, backClassName = "back-button", backButtonId = "backButton", onBack }) {
    const navigate = useNavigate();
    return (
        <div className="header">
            <img
                src="/assets/robux/back.webp"
                alt="Back"
                className={backClassName}
                id={backButtonId}
                onClick={onBack || (() => navigate(-1))}
            />
            <h1 className="home-title">{title}</h1>
        </div>
    );
}

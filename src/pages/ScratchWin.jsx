import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/layout/PageShell.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import AdBanner from "../components/common/AdBanner.jsx";
import AboutSection from "../components/common/AboutSection.jsx";
import usePageTitle from "../hooks/usePageTitle.js";

// Scratch & Win (scratch-win.html). Canvas scratch-to-reveal logic ported verbatim,
// with mouse + touch handlers and cleanup on unmount. Reveal at >50% then redirect home.
export default function ScratchWin() {
    usePageTitle("Scratch & Win");
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const [revealed, setRevealed] = useState(false);
    // Random reward between 1 and 100 (computed once, like the original).
    const selectedReward = useMemo(() => Math.floor(Math.random() * 100) + 1, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = 320;
        canvas.height = 180;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#8e44ad";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "20px Poppins, sans-serif";
        ctx.fillStyle = "#fff";
        ctx.fillText("Scratch here to reveal!", 60, 90);

        let isScratching = false;
        let redirectTimer = null;
        let done = false;

        function checkScratchCompletion() {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            let scratchedPixels = 0;
            for (let i = 3; i < pixels.length; i += 4) {
                if (pixels[i] === 0) scratchedPixels++;
            }
            const scratchedPercentage = (scratchedPixels / (pixels.length / 4)) * 100;
            if (scratchedPercentage > 50 && !done) {
                done = true;
                canvas.style.pointerEvents = "none";
                setRevealed(true);
                redirectTimer = setTimeout(() => navigate("/home"), 3000);
            }
        }

        function scratch(e) {
            if (!isScratching) return;
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            let x, y;
            if (e.touches) {
                x = e.touches[0].clientX - rect.left;
                y = e.touches[0].clientY - rect.top;
            } else {
                x = e.clientX - rect.left;
                y = e.clientY - rect.top;
            }
            ctx.globalCompositeOperation = "destination-out";
            ctx.beginPath();
            ctx.arc(x, y, 15, 0, Math.PI * 2);
            ctx.fill();
            checkScratchCompletion();
        }

        const onDown = () => (isScratching = true);
        const onUp = () => (isScratching = false);
        const onTouchStart = (e) => { isScratching = true; scratch(e); };

        canvas.addEventListener("mousedown", onDown);
        canvas.addEventListener("mouseup", onUp);
        canvas.addEventListener("mousemove", scratch);
        canvas.addEventListener("touchstart", onTouchStart);
        canvas.addEventListener("touchend", onUp);
        canvas.addEventListener("touchmove", scratch);

        return () => {
            canvas.removeEventListener("mousedown", onDown);
            canvas.removeEventListener("mouseup", onUp);
            canvas.removeEventListener("mousemove", scratch);
            canvas.removeEventListener("touchstart", onTouchStart);
            canvas.removeEventListener("touchend", onUp);
            canvas.removeEventListener("touchmove", scratch);
            if (redirectTimer) clearTimeout(redirectTimer);
        };
    }, [navigate]);

    return (
        <PageShell mainDivStyle={{ backgroundColor: "#6a11cb", color: "#fff" }}>
            <PageHeader title="Scratch Card" />

            <AdBanner bannerId="gpt-banner-scratch-win" placement="scratch_win" containerId="adsense-container" />

            <div className="game_section" style={{ height: "auto" }}>
                <h1 className="h1scratch">🎯 Scratch &amp; Win a Reward 🎯</h1>
                <div id="reward" className={revealed ? "" : "hidden"}>
                    <div className="reward-box">
                        <p>🎉 Congratulations! 🎉</p>
                        <h2 id="rewardValue">Your Reward: {selectedReward}</h2>
                    </div>
                </div>
                <canvas id="scratchCanvas" ref={canvasRef}></canvas>
            </div>

            <AboutSection />
        </PageShell>
    );
}

import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import PageShell from "../components/layout/PageShell.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import AdBanner from "../components/common/AdBanner.jsx";
import usePageTitle from "../hooks/usePageTitle.js";

// Spin Wheel (spin_to_win.html). Chart.js pie + the same rotation-interval algorithm,
// ported unchanged. Chart instance and interval are cleaned up on unmount.
const ROTATION_VALUES = [
    { minDegree: 0, maxDegree: 30, value: 0 },
    { minDegree: 31, maxDegree: 90, value: "20 Rewards" },
    { minDegree: 91, maxDegree: 150, value: "120 Rewards" },
    { minDegree: 151, maxDegree: 210, value: "100 Rewards" },
    { minDegree: 211, maxDegree: 270, value: "80 Rewards" },
    { minDegree: 271, maxDegree: 330, value: "60 Rewards" },
    { minDegree: 331, maxDegree: 360, value: "40 Rewards" },
];
const DATA = [16, 16, 16, 16, 16, 16];
const PIE_COLORS = ["#DA0000", "#DA00B4", "#63ADB9", "#528820", "#95D952", "#E69423    "];

export default function SpinToWin() {
    usePageTitle("Spin Wheel");
    const canvasRef = useRef(null);
    const chartRef = useRef(null);
    const intervalRef = useRef(null);
    const countRef = useRef(0);
    const resultValueRef = useRef(101);

    const [finalText, setFinalText] = useState("Spin the Wheel of Financial Fortune!");
    const [spinning, setSpinning] = useState(false);

    useEffect(() => {
        chartRef.current = new Chart(canvasRef.current, {
            plugins: [ChartDataLabels],
            type: "pie",
            data: {
                labels: [20, 40, 60, 80, 100, 120],
                datasets: [{ backgroundColor: PIE_COLORS, data: DATA }],
            },
            options: {
                responsive: true,
                animation: { duration: 0 },
                plugins: {
                    tooltip: false,
                    legend: { display: false },
                    datalabels: {
                        color: "#ffffff",
                        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
                        font: { size: 24 },
                    },
                },
            },
        });
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (chartRef.current) chartRef.current.destroy();
        };
    }, []);

    function valueGenerator(angleValue) {
        for (const i of ROTATION_VALUES) {
            if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
                setFinalText(`You Won: ${i.value}`);
                setSpinning(false);
                break;
            }
        }
    }

    function handleSpin() {
        if (spinning) return;
        setSpinning(true);
        setFinalText("Good Luck!");
        const randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
        const myChart = chartRef.current;
        intervalRef.current = window.setInterval(() => {
            myChart.options.rotation = myChart.options.rotation + resultValueRef.current;
            myChart.update();
            if (myChart.options.rotation >= 360) {
                countRef.current += 1;
                resultValueRef.current -= 5;
                myChart.options.rotation = 0;
            } else if (countRef.current > 15 && myChart.options.rotation === randomDegree) {
                valueGenerator(randomDegree);
                clearInterval(intervalRef.current);
                countRef.current = 0;
                resultValueRef.current = 101;
            }
        }, 10);
    }

    return (
        <PageShell>
            <PageHeader title="Spin Wheel" />

            <AdBanner bannerId="gpt-banner-spin-to-win" placement="spin_to_win" containerId="adsense-container" />

            <div className="game_section" style={{ height: "auto" }}>
                <canvas id="wheel" ref={canvasRef}></canvas>
                <button id="spin-btn" disabled={spinning} onClick={handleSpin}>Spin</button>
                <img className="imgspin" src="/assets/robux/iv_weel_point.png" alt="spinner arrow" />
            </div>
            <div id="final-value">
                <p>{finalText}</p>
            </div>
        </PageShell>
    );
}

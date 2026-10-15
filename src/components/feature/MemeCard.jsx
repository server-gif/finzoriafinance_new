import { useRef, useState } from "react";

// One meme card from meme.html. Copy uses the rendered .meme-text innerText exactly like the
// original (navigator.clipboard.writeText) and flips the button to "Copied!" for 2s.
export default function MemeCard({ title, children }) {
    const textRef = useRef(null);
    const [copied, setCopied] = useState(false);

    function handleCopy() {
        const text = textRef.current ? textRef.current.innerText : "";
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    return (
        <div className="meme-card">
            <div className="meme-text" ref={textRef}>
                <h3>{title}</h3>
                <p>{children}</p>
            </div>
            <button className="copy-btn" onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</button>
        </div>
    );
}

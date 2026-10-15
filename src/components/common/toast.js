// Imperative toast helpers reproducing the original home.html toasts exactly (same DOM ids,
// classes and timing). Kept out of React state to preserve the precise "show for 5s" behavior
// and the countdown toast's interval.

function ensureToast(id, className, html) {
    let toast = document.getElementById(id);
    if (!toast) {
        toast = document.createElement("div");
        toast.id = id;
        toast.className = className;
        toast.innerHTML = html;
        document.body.appendChild(toast);
    } else {
        toast.className = className;
        toast.innerHTML = html;
    }
    return toast;
}

export function showToast(customMsg) {
    const toast = ensureToast(
        "toast",
        "toast-message",
        customMsg
            ? `<img src="/assets/icons/correct.png" alt="" style="width:20px;height:20px;margin-right:8px;">${customMsg}`
            : `<img src="/assets/icons/correct.png" alt="" style="width:20px;height:20px;margin-right:8px;">You've received 10 coins`
    );
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 5000);
}

export function showErrorToast() {
    const toast = ensureToast(
        "toast",
        "toast-message",
        `❌ Ad not available, try again later`
    );
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 5000);
}

export function showCountdownToast(seconds) {
    const toast = document.createElement("div");
    toast.className = "timer-toast-message show";
    const msg = document.createElement("span");
    msg.textContent = `Wait ${seconds}s...`;
    toast.innerHTML = `<img src="/assets/icons/clock.png" alt="" style="width:20px;height:20px;margin-right:8px;">`;
    toast.appendChild(msg);
    document.body.appendChild(toast);
    let count = seconds;
    const timer = setInterval(() => {
        count--;
        msg.textContent = `Wait ${count}s...`;
        if (count <= 0) {
            clearInterval(timer);
            toast.remove();
        }
    }, 1000);
}

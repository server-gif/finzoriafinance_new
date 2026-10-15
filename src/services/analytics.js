/*
 * SPA port of the original js/analytics.js.
 * All ad/analytics logic is preserved 1:1; only the navigation mechanism changes:
 * instead of `window.location.href = url` we call an injected `navigate` (React Router).
 * Everything initializes exactly once (guarded) to avoid duplicate GPT/analytics work.
 */
import Ads from "./ads.js";

/* ---------------- helpers ---------------- */
function getSubdomainOrDomain(hostname) {
    const cleanHost = hostname.split(':')[0];
    const segments = cleanHost.split('.');
    if (segments.length <= 2) {
        return cleanHost;
    }
    return segments[0];
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

function getPageName() {
    // Return document title or filename without extension
    if (document.title && document.title.trim() !== "") {
        return document.title;
    }
    const path = window.location.pathname;
    const page = path.split("/").pop();
    if (page === "" || page === "index.html") return "Home Page";
    return page.replace(".html", "").split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

/* ---------------- navigator injection ---------------- */
let _navigate = null;
export function setNavigator(fn) { _navigate = fn; }
function goto(url) {
    if (_navigate) _navigate(url);
    else window.location.href = url;
}

/* ---------------- AD IMPRESSION ANALYTICS ---------------- */
// Ad Manager (GPT) has no onPaidEvent, so every viewable impression is reported instead.
async function reportAdImpression(slotId) {
    const sessionId = getCookie("session_id");

    try {
        await fetch("https://1001.roboxquiz.com/api/analytics", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                Domain: window.location.hostname,
                SubDomain: getSubdomainOrDomain(window.location.hostname),
                EventName: `${getSubdomainOrDomain(window.location.hostname)}_ad_impression`,
                AdsPlatform: 'Google',
                AdsFormat: 'Display',
                Currency: 'USD',
                Value: 0,
                AdsSource: 'AdManager',
                GClId: getCookie('gclId') || null,
                AdsUnitName: getPageName(),
                SlotId: slotId || null,
                SessionId: sessionId
            }),
        });
    } catch (error) {
        console.log("Analytics report failed:", error);
    }
}

function generateSessionId() {
    return crypto.randomUUID();
}

function setSessionCookie() {
    const existing = document.cookie
        .split("; ")
        .find((row) => row.startsWith("session_id="));

    if (!existing) {
        const sessionId = generateSessionId();
        document.cookie = `session_id=${sessionId}; path=/; SameSite=Lax`;
    }
}

/* ---------------- AD TIMER LOGIC (Mirroring robloxquiz) ---------------- */
function getAdTimer() {
    return parseInt(localStorage.getItem("ad_timer") || "0", 10);
}

function setAdTimer(val) {
    localStorage.setItem("ad_timer", val.toString());
}

function getIsFirstAd() {
    const val = localStorage.getItem("is_first_ad");
    return val === null || val === "true";
}

function setIsFirstAd(val) {
    localStorage.setItem("is_first_ad", val.toString());
}

/* ---------------- GOOGLE AD MANAGER AD LOGIC ---------------- */
let adLoading = false;
export function getAdLoading() { return adLoading; }
export function setAdLoading(v) { adLoading = v; }

// Interstitial moment: the visitor's first ad, or 60s since the last full-screen ad
function isInterstitialMoment() {
    return getIsFirstAd() || getAdTimer() >= 60;
}

// An interstitial is kept loaded only during an interstitial moment.
function syncInterstitial() {
    if (isInterstitialMoment()) {
        Ads.loadInterstitial();
    } else {
        Ads.dropInterstitial();
    }
}

// After its interstitial is closed, Ad Manager repeats the link click to continue.
// That one click must go straight through instead of starting another ad.
let interstitialJustShown = false;

function consumeInterstitialClick() {
    const wasShown = interstitialJustShown;
    interstitialJustShown = false;
    return wasShown;
}

/* ---------------- FULL-SCREEN AD ON DEMAND ---------------- */
// Button-driven entry points (earn coins, oops popup): always ask for a rewarded ad.
export function showAdWithLogic(onAdDone) {
    try {
        const timer = getAdTimer();
        const isFirstAd = getIsFirstAd();
        console.log(`[AdLogic] Triggered. Timer: ${timer}s, First Ad: ${isFirstAd}`);

        adLoading = true;
        Ads.showRewarded((result) => {
            console.log("[AdLogic] Rewarded Ad result:", result.breakStatus);
            if (isFirstAd || timer >= 60) {
                setIsFirstAd(false);
                setAdTimer(1);
                syncInterstitial();
            }
            adLoading = false;
            onAdDone(result);
        });
    } catch (error) {
        console.log("Error in showAdWithLogic : ", error);
        adLoading = false;
        onAdDone({ breakStatus: "dismissed" });
    }
}

/* ---------------- REWARD AD LOGIC ---------------- */
export function showRewardAdWithLogic(onAdDone) {
    try {
        const timer = getAdTimer();
        console.log(`[RewardAdLogic] Triggered. Timer: ${timer}s`);

        Ads.showRewarded((result) => {
            console.log("[RewardAdLogic] Rewarded Ad result:", result.breakStatus);
            if (timer >= 60) {
                setAdTimer(1);
                syncInterstitial();
            }
            adLoading = false;
            onAdDone(result);
        });
    } catch (error) {
        console.log("Error in showRewardAdWithLogic : ", error);
        adLoading = false;
        onAdDone({ breakStatus: "dismissed" });
    }
}

/* ---------------- GAME SECTION DISPLAY AD FALLBACK MODAL ---------------- */
let modalTimerInterval = null;
let modalAdSlotId = null;

function getOrCreateAdModal() {
    let modal = document.getElementById("gameAdModal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "gameAdModal";
        modal.className = "game-ad-modal-overlay";
        modal.innerHTML = `
            <div class="game-ad-modal-card">
                <div class="game-ad-modal-header">
                    <span class="game-ad-badge">Advertisement</span>
                    <button class="game-ad-close-icon" id="gameAdModalCloseIcon" aria-label="Close" style="display: none;">&times;</button>
                </div>
                <div class="game-ad-slot-wrapper" id="gameAdSlotWrapper"></div>
                <div class="game-ad-modal-footer">
                    <button class="game-ad-continue-btn" id="gameAdContinueBtn" disabled>
                        Continue in <span id="gameAdTimerCount">4</span>s
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    return modal;
}

export function openDisplayAdModal(targetUrl) {
    const modal = getOrCreateAdModal();
    const slotWrapper = document.getElementById("gameAdSlotWrapper");
    const continueBtn = document.getElementById("gameAdContinueBtn");
    const closeIcon = document.getElementById("gameAdModalCloseIcon");

    if (modalTimerInterval) {
        clearInterval(modalTimerInterval);
        modalTimerInterval = null;
    }

    // Close icon is hidden initially until countdown completes
    if (closeIcon) {
        closeIcon.style.display = "none";
    }

    if (modalAdSlotId) Ads.removeBanner(modalAdSlotId);
    modalAdSlotId = "modal-gpt-slot-" + Date.now();
    slotWrapper.innerHTML = `
        <div id="modal-ad-container" style="width:100%; min-height:250px; display:flex; align-items:center; justify-content:center;">
            <div id="${modalAdSlotId}"></div>
        </div>
    `;
    Ads.banner(modalAdSlotId, "popup", Ads.popupSizes);

    // 4-second countdown timer
    let countdown = 4;
    continueBtn.disabled = true;
    continueBtn.classList.remove("enabled");
    continueBtn.innerHTML = `Continue in <span id="gameAdTimerCount">${countdown}</span>s`;

    modalTimerInterval = setInterval(() => {
        countdown--;
        const countSpan = document.getElementById("gameAdTimerCount");
        if (countSpan) countSpan.textContent = countdown;
        if (countdown > 0) {
            continueBtn.innerHTML = `Continue in <span id="gameAdTimerCount">${countdown}</span>s`;
        } else {
            clearInterval(modalTimerInterval);
            modalTimerInterval = null;
            continueBtn.disabled = false;
            continueBtn.classList.add("enabled");
            continueBtn.innerHTML = `Continue &rarr;`;
            // Show close icon when continue button becomes enabled
            if (closeIcon) {
                closeIcon.style.display = "flex";
            }
        }
    }, 1000);

    // Continue button redirects to destination URL
    continueBtn.onclick = function () {
        if (continueBtn.disabled) return;
        if (modalTimerInterval) clearInterval(modalTimerInterval);
        modal.classList.remove("active");
        if (targetUrl) {
            goto(targetUrl);
        }
    };

    // Close icon also redirects as it is like continue button
    if (closeIcon) {
        closeIcon.onclick = function () {
            if (modalTimerInterval) clearInterval(modalTimerInterval);
            modal.classList.remove("active");
            if (targetUrl) {
                goto(targetUrl);
            }
        };
    }

    modal.classList.add("active");
}

// Reached only when Ad Manager had no interstitial for this click: show the display ad popup instead
export function showGameSectionInterstitial(targetUrl) {
    console.log("[AdLogic] Game section clicked without interstitial. Opening display ad modal for:", targetUrl);
    openDisplayAdModal(targetUrl);
}

/* ---------------- NAVIGATION INTERCEPTION ---------------- */
// Mirrors the original document.body click handler, but driven per-click by SmartLink.
// Returns true if this handler took over navigation (caller must preventDefault).
export function interceptNavigation({ url, isRewardsLink, isClothesLink }) {
    if (consumeInterstitialClick()) {
        // an interstitial just played and repeated this click -> let it go straight through
        return false;
    }
    if (isClothesLink) {
        showGameSectionInterstitial(url);
    } else if (isRewardsLink) {
        showRewardAdWithLogic(function () {
            goto(url);
        });
    } else {
        showAdWithLogic(function () {
            goto(url);
        });
    }
    return true;
}

/* ---------------- one-time initialization ---------------- */
let initialized = false;

export function initAnalytics() {
    if (initialized) return;
    initialized = true;

    window.googletag = window.googletag || { cmd: [] };
    googletag.cmd.push(function () {
        googletag.pubads().addEventListener("impressionViewable", function (event) {
            reportAdImpression(event.slot.getSlotElementId());
        });
    });

    // session + gclid cookies (originally done on DOMContentLoaded)
    setSessionCookie();
    const urlParams = new URLSearchParams(window.location.search);
    const gclId = urlParams.get("gclid");
    if (gclId) {
        document.cookie = `gclId=${gclId}; path=/; SameSite=Lax`;
    }

    // Global Timer Interval
    setInterval(() => {
        let currentTimer = getAdTimer();
        setAdTimer(currentTimer + 1);
        syncInterstitial();
    }, 1000);

    Ads.onInterstitialShown(() => {
        console.log("[AdLogic] Interstitial shown on link click.");
        setIsFirstAd(false);
        setAdTimer(1);
        interstitialJustShown = true;
    });
    syncInterstitial();
}

/* ---------------- route page-view tracking ---------------- */
// The original sent one gtag config per full page load. For an SPA we resend on each route change.
export function trackPageView(path) {
    if (typeof window.gtag === "function") {
        window.gtag("config", "G-W1XE95VFRP", { page_path: path });
    }
}

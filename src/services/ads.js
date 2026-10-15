/* Google Ad Manager (GPT) integration. Ad unit paths come from config/ads-config.js. */
import { ADS_CONFIG } from "../config/ads-config.js";

if (typeof window !== "undefined") {
    window.googletag = window.googletag || { cmd: [] };
}

const Ads = (function () {
    var config = ADS_CONFIG || window.ADS_CONFIG || {};
    var placements = config.placements || {};
    // How long to wait for a rewarded ad before letting the visitor continue without one.
    var REWARDED_READY_TIMEOUT_MS = 6000;

    var bannerSlots = {};
    var interstitialSlot = null;
    var interstitialRequested = false;
    var interstitialShowing = false;
    var interstitialShownOnce = false;
    var interstitialShownHandlers = [];
    var rewardedCallbacks = null;

    googletag.cmd.push(function () {
        googletag.pubads().collapseEmptyDivs();
        googletag.pubads().addEventListener("slotVisibilityChanged", function (event) {
            if (event.slot === interstitialSlot && event.inViewPercentage > 0 && !interstitialShowing) {
                interstitialShowing = true;
                interstitialShownOnce = true;
                interstitialShownHandlers.forEach(function (handler) { handler(); });
            }
        });
        googletag.enableServices();
    });

    /* ---------------- BANNER ---------------- */
    function banner(divId, placement, sizes) {
        var path = placements[placement] || config.display;
        if (!path) return;
        googletag.cmd.push(function () {
            var slot = googletag.defineSlot(path, sizes || config.displaySizes, divId);
            if (!slot) return;
            slot.addService(googletag.pubads());
            bannerSlots[divId] = slot;
            googletag.display(divId);
        });
    }

    function removeBanner(divId) {
        googletag.cmd.push(function () {
            if (bannerSlots[divId]) {
                googletag.destroySlots([bannerSlots[divId]]);
                delete bannerSlots[divId];
            }
        });
    }

    /* ---------------- INTERSTITIAL ---------------- */
    // Ad Manager shows a loaded interstitial by itself on the next link click and then
    // continues to that link, so the site only decides when one should be loaded.
    function loadInterstitial() {
        if (!config.interstitial) return;
        if (interstitialRequested && !interstitialShownOnce) return;
        if (interstitialRequested && interstitialShownOnce) {
            // The old slot already played and cannot play again on this page: discard it
            // and define a fresh one so the next 60s moment can show an interstitial too.
            interstitialRequested = false;
            interstitialShowing = false;
            interstitialShownOnce = false;
            googletag.cmd.push(function () {
                if (interstitialSlot) {
                    googletag.destroySlots([interstitialSlot]);
                    interstitialSlot = null;
                }
                loadInterstitial();
            });
            return;
        }
        interstitialRequested = true;
        googletag.cmd.push(function () {
            if (!interstitialRequested) return;
            interstitialSlot = googletag.defineOutOfPageSlot(config.interstitial, googletag.enums.OutOfPageFormat.INTERSTITIAL);
            if (!interstitialSlot) return;
            interstitialSlot.addService(googletag.pubads());
            googletag.display(interstitialSlot);
        });
    }

    function dropInterstitial() {
        if (!interstitialRequested || interstitialShowing) return;
        interstitialRequested = false;
        googletag.cmd.push(function () {
            if (interstitialSlot && !interstitialShowing) {
                googletag.destroySlots([interstitialSlot]);
                interstitialSlot = null;
            }
        });
    }

    function onInterstitialShown(handler) {
        interstitialShownHandlers.push(handler);
    }

    /* ---------------- REWARDED ---------------- */
    // onDone receives { breakStatus: 'viewed' | 'dismissed' }; 'viewed' only when the reward was granted.
    // It is always called: also when no ad is available or the ad script is blocked.
    function showRewarded(onDone) {
        if (rewardedCallbacks) {
            rewardedCallbacks.push(onDone);
            return;
        }
        var callbacks = rewardedCallbacks = [onDone];
        var slot = null;
        var granted = false;
        var finished = false;
        var listeners = {};
        var readyTimer = setTimeout(finish, REWARDED_READY_TIMEOUT_MS);

        function finish() {
            if (finished) return;
            finished = true;
            rewardedCallbacks = null;
            clearTimeout(readyTimer);
            googletag.cmd.push(function () {
                Object.keys(listeners).forEach(function (name) {
                    googletag.pubads().removeEventListener(name, listeners[name]);
                });
                if (slot) googletag.destroySlots([slot]);
            });
            var status = granted ? "viewed" : "dismissed";
            setTimeout(function () {
                callbacks.forEach(function (callback) {
                    callback({ breakStatus: status, rewardStatus: status });
                });
            });
        }

        function listen(name, handler) {
            listeners[name] = function (event) {
                if (event.slot === slot) handler(event);
            };
            googletag.pubads().addEventListener(name, listeners[name]);
        }

        if (!config.rewarded) {
            finish();
            return;
        }

        googletag.cmd.push(function () {
            if (finished) return;
            slot = googletag.defineOutOfPageSlot(config.rewarded, googletag.enums.OutOfPageFormat.REWARDED);
            if (!slot) {
                console.log("GPT Rewarded ads are not supported.");
                finish();
                return;
            }
            slot.addService(googletag.pubads());

            listen("rewardedSlotReady", function (event) {
                clearTimeout(readyTimer);
                event.makeRewardedVisible();
            });
            listen("rewardedSlotGranted", function () {
                granted = true;
            });
            listen("rewardedSlotClosed", finish);
            listen("slotRenderEnded", function (event) {
                if (event.isEmpty) finish();
            });

            googletag.display(slot);
        });
    }

    return {
        banner: banner,
        removeBanner: removeBanner,
        popupSizes: config.popupSizes,
        loadInterstitial: loadInterstitial,
        dropInterstitial: dropInterstitial,
        onInterstitialShown: onInterstitialShown,
        showRewarded: showRewarded
    };
})();

export default Ads;

/*
 * Google Ad Manager ad units for the whole site.
 * Change the ad unit paths here only - every page reads them from this file.
 * Path format: /NETWORK_CODE/AD_UNIT_NAME
 * (Ad Manager > Inventory > Ad units > open the ad unit > Tags shows the path.)
 */
/*
 * TEST ADS ARE ON: the three paths below are Google's public sample ad units. They show
 * test ads on any domain (also localhost) and earn nothing.
 * BEFORE GOING LIVE replace each one with your own ad unit path, e.g. the LIVE line next to it.
 */

export const ADS_CONFIG = {
    // Banner shown on every page and in the popup, unless a place below has its own ad unit.
    // LIVE: "/23357075583/ca-pub-6444912182503724-tag/fflivegame_RBX_Display1"
    display: import.meta.env.VITE_GAM_DISPLAY,

    // Second banner tag for pages with 2 banners (e.g. home bottom / middle).
    // LIVE: "/23357075583/ca-pub-6444912182503724-tag/fflivegame_RBX_Display2"
    display2: import.meta.env.VITE_GAM_DISPLAY2,

    // Full-screen ad shown on a link click: the visitor's first click, then again once 60s have passed.
    // LIVE: "/23357075583/ca-pub-6444912182503724-tag/fflivegame_RBX_Interstitial"
    interstitial: import.meta.env.VITE_GAM_INTERSTITIAL,

    // Full-screen rewarded ad: Earn Free Coins, the reward cards, and clicks inside the 60s window.
    // LIVE: "/23357075583/ca-pub-6444912182503724-tag/fflivegame_RBX_Reward"
    rewarded: import.meta.env.VITE_GAM_REWARDED,

    // Banner sizes requested from Ad Manager. The ad unit must allow these sizes.
    displaySizes: [[300, 250], [320, 480], [336, 280]],
    popupSizes: [[300, 250]],

    // Optional: a separate banner ad unit for one place. Leave "" to use `display`.
    placements: {
        index: "",
        home_top: import.meta.env.VITE_GAM_DISPLAY,
        home_middle: import.meta.env.VITE_GAM_DISPLAY2,
        quiz: "",
        spin_to_win: "",
        scratch_win: "",
        meme: "",
        clothes: "",
        anime: "",
        skin: "",
        skinactive: "",
        daily_r_converter: "",
        daily_free_rbx_cal: "",
        bc_rbx_counter: "",
        tbc_rbx_counter: "",
        obc_rbx_counter: "",
        dollar_rbx_cal: "",
        rbx_dollar_cal: "",
        popup: ""
    }
};

// Keep the global for any code (or the GPT wrapper) that expects window.ADS_CONFIG.
if (typeof window !== "undefined") {
    window.ADS_CONFIG = ADS_CONFIG;
}

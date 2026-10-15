import { createContext, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { initAnalytics, setNavigator, trackPageView } from "../services/analytics.js";

const AdContext = createContext(null);

// Owns the app-wide ad/analytics lifecycle for the SPA:
//  - initializes GPT/analytics exactly once (no duplicate timers or listeners)
//  - wires React Router's navigate into the analytics service (replaces window.location.href)
//  - re-sends a gtag page_view on every route change (the original sent one per full page load)
export function AdProvider({ children }) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        initAnalytics();
    }, []);

    useEffect(() => {
        // Route paths are already clean ("/home", "/bc-rbx-counter", ...).
        setNavigator((to) => navigate(to));
    }, [navigate]);

    useEffect(() => {
        trackPageView(location.pathname);
    }, [location.pathname]);

    const value = useMemo(() => ({ navigate }), [navigate]);

    return <AdContext.Provider value={value}>{children}</AdContext.Provider>;
}

export function useAdContext() {
    return AdContext;
}

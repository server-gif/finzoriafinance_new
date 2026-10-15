import { useCallback, useState } from "react";
import { safeGetItem, safeSetItem } from "../utils/storage.js";

// Coin balance backed by localStorage, matching the original home.html behavior:
// read on mount, addCoins(amount) persists and updates the displayed value.
export default function useCoins() {
    const [coins, setCoins] = useState(() => parseInt(safeGetItem("coins")) || 0);

    const addCoins = useCallback((amount) => {
        setCoins((prev) => {
            const next = prev + amount;
            safeSetItem("coins", next);
            return next;
        });
    }, []);

    const setCoinsValue = useCallback((value) => {
        safeSetItem("coins", value);
        setCoins(value);
    }, []);

    return { coins, setCoins, addCoins, setCoinsValue };
}

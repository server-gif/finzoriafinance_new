import { useEffect } from "react";

// Sets document.title per route. This is also what analytics' getPageName() reads for
// ad-impression reporting, so keeping the title correct preserves the original reporting.
export default function usePageTitle(title) {
    useEffect(() => {
        if (title) document.title = title;
    }, [title]);
}

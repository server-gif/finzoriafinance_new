import { useNavigate } from "react-router-dom";
import { interceptNavigation, showAdWithLogic } from "../../services/analytics.js";
import { toRoutePath } from "../../utils/routes.js";

// A single anchor that reproduces the original global body-click ad interceptor:
//  - special links (#, mailto:, tel:, javascript:, .no-ad) pass straight through
//  - external links run a rewarded ad, then leave the tab (window.location.href)
//  - internal links run the same interstitial / rewards / clothes decision tree, then
//    navigate via React Router instead of a full page load.
export default function SmartLink({ href, className, children, ...rest }) {
    const navigate = useNavigate();
    const isExternal = /^https?:\/\//.test(href);
    const isSpecial = /^(#|mailto:|tel:|javascript:)/.test(href);
    const routePath = toRoutePath(href);
    const displayHref = isExternal || isSpecial ? href : routePath;

    function handleClick(e) {
        if (e.defaultPrevented) return;
        const link = e.target.closest("a");
        if (isSpecial || (link && link.classList.contains("no-ad"))) return; // normal anchor behavior

        e.preventDefault();

        if (isExternal) {
            showAdWithLogic(() => { window.location.href = href; });
            return;
        }

        const isRewardsLink = !!(link && link.closest(".rewards"));
        const isClothesLink = routePath === "/clothes";
        const tookOver = interceptNavigation({ url: routePath, isRewardsLink, isClothesLink });
        // tookOver === false means an interstitial just consumed this click: go straight through.
        if (!tookOver) navigate(routePath);
    }

    return (
        <a href={displayHref} className={className} onClick={handleClick} {...rest}>
            {children}
        </a>
    );
}

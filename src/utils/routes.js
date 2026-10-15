// Map an original href (e.g. "home.html", "spin_to_win.html", "/index.html") to a clean
// route path ("/home", "/spin_to_win", "/"). External / special schemes are returned as-is.
export function toRoutePath(href) {
    if (!href) return href;
    if (/^(https?:)?\/\//.test(href)) return href; // external
    if (/^(#|mailto:|tel:|javascript:)/.test(href)) return href; // special
    let name = href.replace(/^\.?\//, "").replace(/^index\.html$/, "").replace(/\.html$/, "");
    if (name === "" ) return "/";
    return "/" + name;
}

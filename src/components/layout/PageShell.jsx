// Wraps every page body exactly like the static layout:
// <section><main> bg-top / bg-bottom / main_div > fff_game_section.
// `mainDivStyle` preserves pages that customized .main_div inline (e.g. scratch-win).
export default function PageShell({ children, mainDivStyle }) {
    return (
        <section>
            <main>
                <div className="bg-top"></div>
                <div className="bg-bottom"></div>
                <div className="main_div" style={mainDivStyle}>
                    <div className="fff_game_section">
                        {children}
                    </div>
                </div>
            </main>
        </section>
    );
}

import PageShell from "../components/layout/PageShell.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import SimpleCalculator from "../components/feature/SimpleCalculator.jsx";
import AboutSection from "../components/common/AboutSection.jsx";
import usePageTitle from "../hooks/usePageTitle.js";
import { bcCounter } from "../utils/calculations.js";

export default function BcRbxCounter() {
    usePageTitle("Finance Reward Counter");
    return (
        <PageShell>
            <PageHeader title="Daily Reward Counter" />
            <SimpleCalculator
                placeholder="Enter Number of Days"
                alertMessage="Please enter a valid number of days"
                compute={bcCounter}
                resultLabel={<span>If You save every day at the Basic rate<br />You will get :</span>}
                bannerId="gpt-banner-bc-rbx-counter"
                bannerPlacement="bc_rbx_counter"
            />
            <AboutSection />
        </PageShell>
    );
}

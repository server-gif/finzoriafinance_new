import PageShell from "../components/layout/PageShell.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import SimpleCalculator from "../components/feature/SimpleCalculator.jsx";
import usePageTitle from "../hooks/usePageTitle.js";
import { obcCounter } from "../utils/calculations.js";

export default function ObcRbxCounter() {
    usePageTitle("Premium Savings Counter");
    return (
        <PageShell>
            <PageHeader title="OBC Savings Counter" />
            <SimpleCalculator
                placeholder="Enter Number of Days"
                alertMessage="Please enter a valid number of days"
                compute={obcCounter}
                resultLabel={<span>If You are on the Premium savings plan<br />You will save :</span>}
                bannerId="gpt-banner-obc-rbx-counter"
                bannerPlacement="obc_rbx_counter"
            />
        </PageShell>
    );
}

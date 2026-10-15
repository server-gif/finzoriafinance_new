import PageShell from "../components/layout/PageShell.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import SimpleCalculator from "../components/feature/SimpleCalculator.jsx";
import usePageTitle from "../hooks/usePageTitle.js";
import { rbxToDollar } from "../utils/calculations.js";

export default function RbxDollarCalculator() {
    usePageTitle("RBX to Dollar Calculator");
    return (
        <PageShell>
            <PageHeader title="RBX to Dollar Calculator" />
            <SimpleCalculator
                placeholder="Enter Rbx Amount"
                alertMessage="Please enter the RBX amount"
                compute={rbxToDollar}
                resultLabel="This much RBX is worth :"
                bannerId="gpt-banner-rbx-dollar-cal"
                bannerPlacement="rbx_dollar_cal"
            />
        </PageShell>
    );
}

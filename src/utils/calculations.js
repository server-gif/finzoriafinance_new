// Real finance & cloud calculation formulas used across calculator pages.

/**
 * SIP (Systematic Investment Plan) Future Value
 * @param {number} monthlyAmount - Monthly investment
 * @param {number} annualRate - Expected annual return rate (%)
 * @param {number} years - Investment period in years
 * @returns {{ fv: number, invested: number, gains: number } | null}
 */
export function calcSIP(monthlyAmount, annualRate, years) {
    const P = parseFloat(monthlyAmount);
    const r = parseFloat(annualRate) / 100 / 12; // monthly rate
    const n = parseInt(years, 10) * 12; // months
    if (isNaN(P) || P <= 0 || isNaN(r) || r <= 0 || isNaN(n) || n <= 0) return null;
    const fv = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = P * n;
    return { fv: Math.round(fv), invested: Math.round(invested), gains: Math.round(fv - invested) };
}

/**
 * EMI (Equated Monthly Installment) Calculator
 * @param {number} loanAmount - Total loan/principal
 * @param {number} annualRate - Interest rate per annum (%)
 * @param {number} tenureMonths - Loan tenure in months
 * @returns {{ emi: number, totalInterest: number, totalPayment: number } | null}
 */
export function calcEMI(loanAmount, annualRate, tenureMonths) {
    const P = parseFloat(loanAmount);
    const r = parseFloat(annualRate) / 100 / 12;
    const n = parseInt(tenureMonths, 10);
    if (isNaN(P) || P <= 0 || isNaN(r) || r <= 0 || isNaN(n) || n <= 0) return null;
    const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    return { emi: Math.round(emi), totalInterest: Math.round(totalPayment - P), totalPayment: Math.round(totalPayment) };
}

/**
 * Compound Interest Calculator
 * @param {number} principal - Initial amount
 * @param {number} annualRate - Annual interest rate (%)
 * @param {number} years - Time period in years
 * @param {number} timesCompounded - Compounding frequency per year (1=annual,4=quarterly,12=monthly,365=daily)
 * @returns {{ amount: number, ci: number } | null}
 */
export function calcCompoundInterest(principal, annualRate, years, timesCompounded) {
    const P = parseFloat(principal);
    const r = parseFloat(annualRate) / 100;
    const t = parseFloat(years);
    const n = parseInt(timesCompounded, 10) || 12;
    if (isNaN(P) || P <= 0 || isNaN(r) || r <= 0 || isNaN(t) || t <= 0) return null;
    const amount = P * Math.pow(1 + r / n, n * t);
    return { amount: Math.round(amount), ci: Math.round(amount - P) };
}

/**
 * Cloud Cost Estimator
 * @param {number} instances - Number of VM instances
 * @param {number} hoursPerDay - Hours running per day
 * @param {number} pricePerHour - Cost per instance per hour ($)
 * @param {number} storageGB - Total storage in GB
 * @param {number} storagePricePerGB - Price per GB per month ($)
 * @returns {{ computeCost: number, storageCost: number, totalMonthly: number } | null}
 */
export function calcCloudCost(instances, hoursPerDay, pricePerHour, storageGB, storagePricePerGB) {
    const vmCount = parseInt(instances, 10);
    const hours = parseFloat(hoursPerDay);
    const rate = parseFloat(pricePerHour);
    const storage = parseFloat(storageGB);
    const storageRate = parseFloat(storagePricePerGB) || 0.02;
    if (isNaN(vmCount) || vmCount <= 0 || isNaN(hours) || hours <= 0 || isNaN(rate) || rate <= 0) return null;
    const computeCost = vmCount * hours * rate * 30;
    const storageCost = storage * storageRate;
    return {
        computeCost: Math.round(computeCost * 100) / 100,
        storageCost: Math.round(storageCost * 100) / 100,
        totalMonthly: Math.round((computeCost + storageCost) * 100) / 100
    };
}

/**
 * Savings Goal Calculator - how many days to reach goal
 * @param {number} goal - Target amount
 * @param {number} dailySaving - Amount saved daily
 * @param {number} initialAmount - Already saved amount
 * @returns {{ days: number, months: number } | null}
 */
export function calcSavingsGoal(goal, dailySaving, initialAmount) {
    const target = parseFloat(goal);
    const daily = parseFloat(dailySaving);
    const saved = parseFloat(initialAmount) || 0;
    if (isNaN(target) || target <= 0 || isNaN(daily) || daily <= 0) return null;
    const remaining = target - saved;
    if (remaining <= 0) return { days: 0, months: 0 };
    const days = Math.ceil(remaining / daily);
    return { days, months: Math.round(days / 30.4 * 10) / 10 };
}

// Legacy exports for backward compat with old page references
export function rbxToDollar(rbx) { return calcSIP(rbx, 12, 1) ? `₹${rbx}` : null; }
export function dollarToRbx(dollars) { return calcSIP(dollars, 12, 1) ? `$${dollars}` : null; }
export function bcCounter(days) { return null; }
export function tbcCounter(days) { return null; }
export function obcCounter(days) { return null; }

// Безопасное преобразование значения в число
export function safe(n) {
  const x = Number(n);
  return isNaN(x) ? 0 : x;
}

// Labor = Direct + Management + Taxes
export function calcLabor({ 'Direct Labor': d, 'Management Labor': m, 'Taxes and Benefits': t }) {
  return safe(d) + safe(m) + safe(t);
}

// Controllable Profit = Net Sales - (COGS + Labor + Controllables + Advertising)
export function calcControllableProfit({ netSales, cogs, labor, controllables, advertising }) {
  return safe(netSales) - (
    safe(cogs) + safe(labor) + safe(controllables) + safe(advertising)
  );
}

// Adjusted CP = CP + Bonus + Workers Comp
export function calcAdjustedCP(cp, bonus, wc) {
  return safe(cp) + safe(bonus) + safe(wc);
}

// Restaurant Contribution = CP - Fixed Costs
export function calcRestaurantContribution(cp, fixedCost) {
  return safe(cp) - safe(fixedCost);
}

// Cash Flow = RC + Amortization + Depreciation
export function calcCashFlow(rc, amort, depr) {
  return safe(rc) + safe(amort) + safe(depr);
}

// Flow Thru = (CP actual - CP prior) / (Net Sales actual - Net Sales prior)
export function calcFlowThru(cp, cpPrior, ns, nsPrior) {
  const deltaCP = safe(cp) - safe(cpPrior);
  const deltaNS = safe(ns) - safe(nsPrior);
  return deltaNS !== 0 ? (deltaCP / deltaNS) * 100 : 0;
}

// SSS = (Actual - Prior) / Prior * 100
export function calcSSS(actual, prior) {
  return safe(prior) !== 0 ? ((safe(actual) - safe(prior)) / safe(prior)) * 100 : 0;
}

// CP % = CP / Net Sales
export function calcControllableProfitPercent(cp, netSales) {
  return safe(netSales) !== 0 ? (safe(cp) / safe(netSales)) * 100 : 0;
}

// Labor % = Total Labor / Net Sales * 100
export function calcLaborPercent(labor, netSales) {
  return safe(netSales) !== 0 ? (safe(labor) / safe(netSales)) * 100 : 0;
}

// CP Improvement = CP actual - CP prior
export function calcCPImprovement(cp, cpPrior) {
  return safe(cp) - safe(cpPrior);
}

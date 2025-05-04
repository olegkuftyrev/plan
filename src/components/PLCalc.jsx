// src/components/PLCalc.jsx
import React from 'react';
import { Card, Col, Row, Tooltip, Typography } from 'antd';
import {
  calcSSS,
  calcLabor,
  calcControllableProfit,
  calcAdjustedCP,
  calcRestaurantContribution,
  calcCashFlow,
  calcFlowThru,
  calcLaborPercent,
  calcControllableProfitPercent,
  calcCPImprovement,
  safe,
} from '../utils/calcUtils';

const { Text, Title } = Typography;

// Ищет последний Advertising перед Controllable Profit
function getLastAdvertisingBeforeCP(rows, actualIdx) {
  const cpIndex = rows.findIndex(row => row[0] === 'Controllable Profit');
  if (cpIndex === -1) return 0;
  for (let i = cpIndex - 1; i >= 0; i--) {
    if ((rows[i][0] || '').toString().trim() === 'Advertising') {
      return safe(rows[i][actualIdx]);
    }
  }
  return 0;
}

export default function PLCalc({ rows, values, actualIdx }) {
  const actual   = safe(values['Net Sales']);
  const prior    = safe(values['Prior Net Sales']);
  const plan     = safe(values['Plan Net Sales']);
  const direct   = safe(values['Direct Labor']);
  const mgmt     = safe(values['Management Labor']);
  const tax      = safe(values['Taxes and Benefits']);
  const laborTot = calcLabor({
    'Direct Labor': direct,
    'Management Labor': mgmt,
    'Taxes and Benefits': tax,
  });

  const cogs         = safe(values['Cost of Goods Sold']);
  const controllables = safe(values['Total Controllables']);
  const adv          = getLastAdvertisingBeforeCP(rows, actualIdx);

  const cp       = calcControllableProfit({ netSales: actual, cogs, labor: laborTot, controllables, advertising: adv });
  const cpPrior  = safe(values['Prior Controllable Profit']);
  const cpChange = calcCPImprovement(cp, cpPrior);

  const bonus = safe(values['Bonus']);
  const wc    = safe(values['Workers Comp']);
  const adjCP = calcAdjustedCP(cp, bonus, wc);

  const fixed      = safe(values['Total Fixed Cost']);
  const restaurant = calcRestaurantContribution(cp, fixed);

  const amort     = safe(values['Amortization']);
  const depr      = safe(values['Depreciation']);
  const cashflow  = calcCashFlow(restaurant, amort, depr);

  const flow       = calcFlowThru(cp, cpPrior, actual, prior);
  const cpPercent  = calcControllableProfitPercent(cp, actual);
  const laborPerc  = calcLaborPercent(laborTot, actual);
  const sss        = calcSSS(actual, prior);

  // Собираем все метрики в массив
  const metrics = [
    {
      label: 'Net Sales (Actual)',
      value: `$${actual.toLocaleString()}`,
      formula: 'Net Sales (Actual)',
      applied: `Actual Net Sales: $${actual}`,
    },
    {
      label: 'COGS $',
      value: `$${cogs.toLocaleString()}`,
      formula: 'Cost of Goods Sold',
      applied: `COGS: $${cogs}`,
    },
    {
      label: 'COGS %',
      value: `${((actual>0?cogs/actual:0)*100).toFixed(2)}%`,
      color: (actual>0?cogs/actual*100:0) >= 30 ? 'red' : 'green',
      formula: 'COGS / Net Sales * 100',
      applied: `$${cogs} / $${actual}`,
    },
    {
      label: 'Labor Total',
      value: `$${laborTot.toLocaleString()}`,
      formula: 'Direct + Management + Taxes',
      applied: `$${direct} + $${mgmt} + $${tax}`,
    },
    {
      label: 'Labor %',
      value: `${laborPerc.toFixed(2)}%`,
      color: laborPerc > 30 ? 'red' : 'black',
      formula: 'Total Labor / Net Sales * 100',
      applied: `$${laborTot} / $${actual}`,
    },
    {
      label: 'Controllable Profit $',
      value: `$${cp.toLocaleString()}`,
      formula: 'Net Sales - (COGS + Labor + Controllables + Advertising)',
      applied: `$${actual} - ($${cogs} + $${laborTot} + $${controllables} + $${adv})`,
    },
    {
      label: 'CP %',
      value: `${cpPercent.toFixed(2)}%`,
      formula: 'CP / Net Sales * 100',
      applied: `$${cp} / $${actual}`,
    },
    {
      label: 'Adjusted CP',
      value: `$${adjCP.toLocaleString()}`,
      formula: 'CP + Bonus + Workers Comp',
      applied: `$${cp} + $${bonus} + $${wc}`,
    },
    {
      label: 'CP Improvement',
      value: `$${cpChange.toLocaleString()}`,
      color: cpChange >= 0 ? 'green' : 'red',
      formula: 'CP Actual - CP Prior',
      applied: `$${cp} - $${cpPrior}`,
    },
    {
      label: 'Restaurant Contribution',
      value: `$${restaurant.toLocaleString()}`,
      formula: 'CP - Fixed Cost',
      applied: `$${cp} - $${fixed}`,
    },
    {
      label: 'Cash Flow',
      value: `$${cashflow.toLocaleString()}`,
      formula: 'RC + Amortization + Depreciation',
      applied: `$${restaurant} + $${amort} + $${depr}`,
    },
    {
      label: 'Flow Thru %',
      value: `${flow.toFixed(2)}%`,
      formula: '(CP Actual - CP Prior) / (Net Sales Actual - Net Sales Prior) * 100',
      applied: `($${cp} - $${cpPrior}) / ($${actual} - $${prior})`,
    },
    {
      label: 'SSS %',
      value: `${sss.toFixed(2)}%`,
      color: sss >= 0 ? 'green' : 'red',
      formula: '(Actual Net Sales - Prior Net Sales) / Prior Net Sales * 100',
      applied: `($${actual} - $${prior}) / $${prior}`,
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {metrics.map(({ label, value, color, formula, applied }, i) => (
        <Col key={i} xs={24} sm={12} md={8} lg={6}>
          <Card size="small">
            <Text type="secondary">{label}</Text>
            <br />
            <Text strong style={{ color: color || 'black' }}>
              {value}
            </Text>
            <br />
            <Tooltip title={applied}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {formula}
              </Text>
            </Tooltip>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

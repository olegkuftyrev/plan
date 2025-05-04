// src/components/Knows.jsx
import React from 'react';
import { Card, Col, Row, Typography, Badge } from 'antd';
import { safe } from '../utils/calcUtils';

const { Text } = Typography;

export default function Knows({ values }) {
  // Base metrics
  const checkAvg     = safe(values['Check Avg - Net']);
  const netSales     = safe(values['Net Sales']);
  const thirdParty   = safe(values['3rd Party Digital Sales']);
  const pandaDigital = safe(values['Panda Digital Sales']);
  const hourlyWage   = safe(values['Average Hourly Wage']);
  const overtimeHrs  = safe(values['Overtime Hours']);
  const transactions = safe(values['Total Transactions']);

  // Daypart %
  const dayparts = {
    'Breakfast %': safe(values['Breakfast %']),
    'Lunch %':     safe(values['Lunch %']),
    'Afternoon %': safe(values['Afternoon %']),
    'Evening %':   safe(values['Evening %']),
  };
  // Determine busiest
  const busiestEntry = Object.entries(dayparts).reduce(
    (max, cur) => (cur[1] > max[1] ? cur : max),
    ['', -Infinity]
  );
  const busiestLabel = busiestEntry[0];

  // OLO%
  const oloPercent = netSales > 0
    ? ((thirdParty + pandaDigital) / netSales) * 100
    : 0;

  // COGS% and Labor%
  const cogsPercent  = netSales > 0 ? (safe(values['Cost of Goods Sold'])  / netSales) * 100 : 0;
  const laborPercent = netSales > 0 ? (safe(values['Total Labor'])         / netSales) * 100 : 0;

  // Prime Cost = COGS% + Labor%
  const primeCost    = cogsPercent + laborPercent;

  // Rent Total
  const rentKeys    = [
    'Rent - MIN',
    'Rent - Storage',
    'Rent - Percent',
    'Rent - Other',
    'Rent - Deferred Preopening',
  ];
  const rentActual  = rentKeys.reduce((sum, k) => sum + safe(values[k]), 0);
  const rentPrior   = rentKeys.reduce((sum, k) => sum + safe(values[`Prior ${k}`]), 0);
  const rentDiff    = rentActual - rentPrior;
  const rentPctDiff = rentPrior ? (rentDiff / rentPrior) * 100 : 0;

  // Repairs
  const repairsAct   = safe(values['Repairs']);
  const repairsPri   = safe(values['Prior Repairs']);
  const repairsDiff  = repairsAct - repairsPri;
  const repairsPct   = repairsPri ? (repairsDiff / repairsPri) * 100 : 0;

  // Maintenance
  const maintAct     = safe(values['Maintenance']);
  const maintPri     = safe(values['Prior Maintenance']);
  const maintDiff    = maintAct - maintPri;
  const maintPct     = maintPri ? (maintDiff / maintPri) * 100 : 0;

  // Build metrics
  const metrics = [
    { label: 'Check Average',       value: `$${checkAvg.toFixed(2)}` },
    { label: 'Actual Net Sales',    value: `$${netSales.toLocaleString()}` },

    {
      label: 'Prime Cost',
      value: `${primeCost.toFixed(2)}%`,
      color: primeCost > 60 ? 'red' : 'green',
    },
    {
      label: 'COGS %',
      value: `${cogsPercent.toFixed(2)}%`,
      color: cogsPercent > 30 ? 'red' : 'green',
    },
    {
      label: 'Labor %',
      value: `${laborPercent.toFixed(2)}%`,
      color: laborPercent > 30 ? 'red' : 'green',
    },

    // Dayparts
    ...Object.entries(dayparts).map(([label, val]) => ({
      label,
      value: `${val.toFixed(2)}%`,
      badge: label === busiestLabel ? { text: 'Busiest Time', color: 'magenta' } : null,
    })),

    { label: 'OLO %',               value: `${oloPercent.toFixed(2)}%` },
    { label: 'Average Hourly Wage', value: `$${hourlyWage.toFixed(2)}` },
    { label: 'Overtime Hours',      value: `${overtimeHrs}` },
    { label: 'Total Transactions',  value: `${transactions}` },

    {
      label: 'Rent Total',
      value: `Act: $${rentActual.toLocaleString()}`,
      detail:`Pri: $${rentPrior.toLocaleString()}`,
      delta: `Δ $${rentDiff.toLocaleString()} (${rentPctDiff.toFixed(2)}%)`,
    },
    {
      label: 'Repairs',
      value: `Act: $${repairsAct.toLocaleString()}`,
      detail:`Pri: $${repairsPri.toLocaleString()}`,
      delta: `Δ $${repairsDiff.toLocaleString()} (${repairsPct.toFixed(2)}%)`,
    },
    {
      label: 'Maintenance',
      value: `Act: $${maintAct.toLocaleString()}`,
      detail:`Pri: $${maintPri.toLocaleString()}`,
      delta: `Δ $${maintDiff.toLocaleString()} (${maintPct.toFixed(2)}%)`,
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {metrics.map(({ label, value, detail, delta, color, badge }, i) => {
        const content = (
          <Card size="small">
            <Text type="secondary">{label}</Text><br/>
            <Text strong style={{ color: color || 'inherit' }}>
              {value}
            </Text><br/>
            {detail && <Text type="secondary">{detail}</Text>}<br/>
            {delta && <Text>{delta}</Text>}
          </Card>
        );
        return (
          <Col key={i} xs={24} sm={12} md={8} lg={6}>
            {badge
              ? <Badge.Ribbon text={badge.text} color={badge.color}>{content}</Badge.Ribbon>
              : content}
          </Col>
        );
      })}
    </Row>
  );
}

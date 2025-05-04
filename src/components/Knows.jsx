// src/components/Knows.jsx
import React from 'react';
import { Card, Col, Row, Typography } from 'antd';
import { safe } from '../utils/calcUtils';

const { Text } = Typography;

export default function Knows({ values }) {
  // Базовые метрики
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
  const busiest = Object.entries(dayparts).sort((a, b) => b[1] - a[1])[0];

  // OLO%
  const oloPercent = netSales > 0
    ? ((thirdParty + pandaDigital) / netSales) * 100
    : 0;

  // Prime Cost = COGS% + Labor%
  const cogsPercent  = netSales > 0 ? safe(values['Cost of Goods Sold']) / netSales * 100 : 0;
  const laborPercent = netSales > 0 ? safe(values['Total Labor']) / netSales * 100 : 0;
  const primeCostPercent = cogsPercent + laborPercent;

  // Rent Total: суммируем пять строк аренды
  const rentKeys = [
    'Rent - MIN',
    'Rent - Storage',
    'Rent - Percent',
    'Rent - Other',
    'Rent - Deferred Preopening',
  ];
  const rentActual = rentKeys.reduce((sum, key) => sum + safe(values[key]), 0);
  const rentPrior  = rentKeys.reduce((sum, key) => sum + safe(values[`Prior ${key}`]), 0);
  const rentDiffCash = rentActual - rentPrior;
  const rentDiffPerc = rentPrior !== 0 ? (rentDiffCash / rentPrior) * 100 : 0;

  // Repairs
  const repairsActual   = safe(values['Repairs']);
  const repairsPrior    = safe(values['Prior Repairs']);
  const repairsDiffCash = repairsActual - repairsPrior;
  const repairsDiffPerc = repairsPrior !== 0 ? (repairsDiffCash / repairsPrior) * 100 : 0;

  // Maintenance
  const maintainActual   = safe(values['Maintenance']);
  const maintainPrior    = safe(values['Prior Maintenance']);
  const maintainDiffCash = maintainActual - maintainPrior;
  const maintainDiffPerc = maintainPrior !== 0 ? (maintainDiffCash / maintainPrior) * 100 : 0;

  // Собираем все карточки
  const metrics = [
    { label: 'Check Average',        value: `$${checkAvg.toFixed(2)}` },
    { label: 'Actual Net Sales',     value: `$${netSales.toLocaleString()}` },
    { label: 'Prime Cost',           value: `${primeCostPercent.toFixed(2)}%` },
    { label: 'Breakfast %',          value: `${dayparts['Breakfast %'].toFixed(2)}%` },
    { label: 'Lunch %',              value: `${dayparts['Lunch %'].toFixed(2)}%` },
    { label: 'Afternoon %',          value: `${dayparts['Afternoon %'].toFixed(2)}%` },
    { label: 'Evening %',            value: `${dayparts['Evening %'].toFixed(2)}%` },
    { label: 'Busiest Time',         value: `${busiest[0]} (${busiest[1].toFixed(2)}%)` },
    { label: 'OLO %',                value: `${oloPercent.toFixed(2)}%` },
    { label: 'Average Hourly Wage',  value: `$${hourlyWage.toFixed(2)}` },
    { label: 'Overtime Hours',       value: `${overtimeHrs}` },
    { label: 'Total Transactions',   value: `${transactions}` },
    {
      label: 'Rent Total',
      value: `Actual: $${rentActual.toLocaleString()}`,
      detail: `Prior: $${rentPrior.toLocaleString()}`,
      delta:  `Δ $${rentDiffCash.toLocaleString()} (${rentDiffPerc.toFixed(2)}%)`,
    },
    {
      label: 'Repairs',
      value: `Actual: $${repairsActual.toLocaleString()}`,
      detail: `Prior: $${repairsPrior.toLocaleString()}`,
      delta:  `Δ $${repairsDiffCash.toLocaleString()} (${repairsDiffPerc.toFixed(2)}%)`,
    },
    {
      label: 'Maintenance',
      value: `Actual: $${maintainActual.toLocaleString()}`,
      detail: `Prior: $${maintainPrior.toLocaleString()}`,
      delta:  `Δ $${maintainDiffCash.toLocaleString()} (${maintainDiffPerc.toFixed(2)}%)`,
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {metrics.map(({ label, value, detail, delta }, idx) => (
        <Col key={idx} xs={24} sm={12} md={8} lg={6}>
          <Card size="small">
            <Text type="secondary">{label}</Text>
            <br />
            <Text strong>{value}</Text>
            <br />
            {detail && <Text type="secondary">{detail}</Text>}
            <br />
            {delta && <Text>{delta}</Text>}
          </Card>
        </Col>
      ))}
    </Row>
  );
}

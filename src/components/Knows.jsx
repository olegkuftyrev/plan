// src/components/Knows.jsx
import React from 'react';
import { Card, Col, Row, Typography } from 'antd';
import { safe } from '../utils/calcUtils';

const { Text } = Typography;

export default function Knows({ values }) {
  // Новые показатели
  const checkAvg = safe(values['Check Avg - Net']);
  const netSales = safe(values['Net Sales']);

  // Daypart %
  const dayparts = {
    'Breakfast %': safe(values['Breakfast %']),
    'Lunch %': safe(values['Lunch %']),
    'Afternoon %': safe(values['Afternoon %']),
    'Evening %': safe(values['Evening %']),
  };
  const busiest = Object.entries(dayparts).sort((a, b) => b[1] - a[1])[0];

  // OLO%
  const thirdParty  = safe(values['3rd Party Digital Sales']);
  const pandaDigital = safe(values['Panda Digital Sales']);
  const oloPercent  = netSales > 0 
    ? ((thirdParty + pandaDigital) / netSales) * 100 
    : 0;

  // Прочие метрики
  const hourlyWage    = safe(values['Average Hourly Wage']);
  const overtimeHours = safe(values['Overtime Hours']);
  const transactions  = safe(values['Total Transactions']);

  // Собираем все карточки
  const metrics = [
    {
      label: 'Actual Net Sales',
      value: `$${netSales.toLocaleString()}`,
    },
    {
      label: 'Total Transactions',
      value: `${transactions}`,
    },
    {
      label: 'Check Average',
      value: `$${checkAvg.toFixed(2)}`,
    },
    {
      label: 'OLO %',
      value: `${oloPercent.toFixed(2)}%`,
    },
    ...Object.entries(dayparts).map(([label, value]) => ({
      label,
      value: `${value.toFixed(2)}%`,
    })),
    {
      label: 'Busiest Time',
      value: `${busiest[0]} (${busiest[1].toFixed(2)}%)`,
    },
    {
      label: 'Average Hourly Wage',
      value: `$${hourlyWage.toFixed(2)}`,
    },
    {
      label: 'Overtime Hours',
      value: `${overtimeHours}`,
    },
 
  ];

  return (
    <Row gutter={[16, 16]}>
      {metrics.map((item, idx) => (
        <Col key={idx} xs={24} sm={12} md={8} lg={6}>
          <Card size="small">
            <Text type="secondary">{item.label}</Text>
            <br />
            <Text strong>{item.value}</Text>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

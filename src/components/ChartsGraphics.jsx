// src/components/ChartsGraphics.jsx
import React from 'react';
import { Card, Row, Col } from 'antd';
import { Pie, Bar } from '@ant-design/charts';

export default function ChartsGraphics() {
  // ==== Фейковые данные для проверки ====
  const pieData = [
    { type: 'Food Sales', value: 10000 },
    { type: 'Drink Sales', value: 1500 },
    { type: 'Retail Sales', value: 500 },
  ];

  const barData = [
    { category: 'Employee Meals',    year: 'Actual', value: 2100 },
    { category: 'Employee Meals',    year: 'Prior',  value: 1800 },
    { category: '20% Emp Discount',  year: 'Actual', value: 130  },
    { category: '20% Emp Discount',  year: 'Prior',  value: 115  },
    { category: 'Coupons/Promotions', year: 'Actual', value: 800 },
    { category: 'Coupons/Promotions', year: 'Prior',  value: 1200 },
  ];

  // ==== Donut (Net Sales Composition) ====
  const pieConfig = {
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: { textAlign: 'center', fontSize: 14 },
    },
    statistic: { title: false, content: false },
    interactions: [{ type: 'element-active' }],
  };

  // ==== Горизонтальный grouped bar для Discounts ====
  const barConfig = {
    data: barData,
    isGroup: true,
    xField: 'value',       // цифры по горизонтали
    yField: 'category',    // категории по вертикали
    seriesField: 'year',   // Actual vs Prior
    dodgePadding: 4,
    marginRatio: 0.1,
    color: ({ year }) => (year === 'Actual' ? '#1890ff' : '#f5222d'),
    label: {
      position: 'right',
      content: ({ value }) => value.toLocaleString(),
      style: { fill: '#000' },
    },
    tooltip: {
      showMarkers: false,
      formatter: ({ year, value }) => ({
        name: year,
        value: value.toLocaleString(),
      }),
    },
    legend: { position: 'top' },
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Card title="Test Donut Chart" size="small">
          <Pie {...pieConfig} />
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card title="Discounts Comparison (Fake Data)" size="small">
          <Bar {...barConfig} />
        </Card>
      </Col>
    </Row>
  );
}

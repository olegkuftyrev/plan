import React, { useMemo } from 'react';
import { Row, Col, Card, Table } from 'antd';

const group1 = [
  'Food Sales',
  'Drink Sales',
  'Retail Sales',
  'Gross Sales',
];
const group2 = [
  'Promotions',
  'Employee Meals',
  '20% Emp Discount',
  'Coupons/Promotions',
];

export default function SalesChart({ rows }) {
  if (!rows?.length) return null;

  const headerRow = rows.find(r => r[0] === 'Ledger Account');
  if (!headerRow) return null;

  const actualIdx = headerRow.findIndex(c => typeof c === 'string' && /actual/i.test(c));
  const priorIdx  = headerRow.findIndex(c => typeof c === 'string' && /prior year/i.test(c));
  if (actualIdx < 0 || priorIdx < 0) return null;

  const makeData = labels =>
    labels.map((label, i) => {
      const row = rows.find(r => r[0] === label) || [];
      const actual = Number((row[actualIdx] || '').toString().replace(/,/g, '')) || 0;
      const prior  = Number((row[priorIdx]  || '').toString().replace(/,/g, '')) || 0;
      return {
        key: i,
        label,
        actual,
        prior,
        diff: actual - prior,
      };
    });

  const data1 = useMemo(() => makeData(group1), [rows]);
  const data2 = useMemo(() => makeData(group2), [rows]);

  const columns = [
    { title: 'Category', dataIndex: 'label', key: 'label' },
    {
      title: 'Actual',
      dataIndex: 'actual',
      key: 'actual',
      align: 'right',
      render: v => v.toLocaleString(),
    },
    {
      title: 'Prior Year',
      dataIndex: 'prior',
      key: 'prior',
      align: 'right',
      render: v => v.toLocaleString(),
    },
    {
      title: 'Difference',
      key: 'diff',
      align: 'right',
      render: (_, record) => {
        const { diff, label } = record;
        const isCostGroup = group2.includes(label);
        const color = isCostGroup
          ? diff <= 0 ? 'green' : 'red'
          : diff >= 0 ? 'green' : 'red';
        return <span style={{ color }}>{diff.toLocaleString()}</span>;
      },
    },
  ];

  return (
    <Row gutter={24}>
      <Col xs={24} md={12}>
        <Card title="Sales vs Prior Year" size="small">
          <Table
            dataSource={data1}
            columns={columns}
            pagination={false}
            size="small"
          />
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card title="Promotions & Discounts vs Prior Year" size="small">
          <Table
            dataSource={data2}
            columns={columns}
            pagination={false}
            size="small"
          />
        </Card>
      </Col>
    </Row>
  );
}

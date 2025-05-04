// src/components/COGSChart.jsx
import React, { useMemo } from 'react';
import { Row, Col, Card, Table } from 'antd';

const categories = [
  'Grocery',
  'Meat',
  'Produce',
  'Sea Food',
  'Drinks',
  'Paper Goods',
  'Other',
];
const totals = ['Cost of Goods Sold'];

export default function COGSChart({ rows }) {
  if (!rows?.length) return null;
  const headerRow = rows.find(r => r[0] === 'Ledger Account');
  if (!headerRow) return null;

  const actualIdx = headerRow.findIndex(c => typeof c === 'string' && /actual/i.test(c));
  const priorIdx  = headerRow.findIndex(c => typeof c === 'string' && /prior year/i.test(c));
  if (actualIdx < 0 || priorIdx < 0) return null;

  const makeData = labels =>
    labels.map((label, i) => {
      const row = rows.find(r => r[0] === label) || [];
      const actual = Number(row[actualIdx]) || 0;
      const prior  = Number(row[priorIdx])  || 0;
      return {
        key: i,
        label,
        actual,
        prior,
        diff: actual - prior,
      };
    });

  const dataCats  = useMemo(() => makeData(categories), [rows]);
  const dataTotal = useMemo(() => makeData(totals),    [rows]);

  const columns = [
    { title: 'Category',    dataIndex: 'label',  key: 'label' },
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
      dataIndex: 'diff',
      key: 'diff',
      align: 'right',
      render: v => (
        <span style={{ color: v >= 0 ? 'red' : 'green' }}>
          {v.toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <Row gutter={24}>
      <Col xs={24} md={12}>
        <Card title="COGS by Category vs Prior Year" size="small">
          <Table
            dataSource={dataCats}
            columns={columns}
            pagination={false}
            size="small"
            scroll={{ x: 'max-content' }}
          />
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card title="Total COGS vs Prior Year" size="small">
          <Table
            dataSource={dataTotal}
            columns={columns}
            pagination={false}
            size="small"
          />
        </Card>
      </Col>
    </Row>
  );
}

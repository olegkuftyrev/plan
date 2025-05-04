// src/components/LaborChart.jsx
import React, { useMemo } from 'react';
import { Row, Col, Card, Table } from 'antd';

const labels = [
  'Front',
  'Back',
  'Overtime',
  'Training Wages',
  'Emergency Store Closure Pay',
  'Direct Labor',
  'GM Salaries',
  'GM Overtime',
  'Other MGMT Salaries',
  'Other MGMT Overtime',
  'Guaranteed Hourly',
  'Bereavement Pay',
  'Guaranteed Overtime',
  'Management Labor',
  'Payroll Taxes',
  'Meal break Premium',
  'Rest Break Premium',
  'Scheduling Premium Pay',
  'Workers Comp',
  'Benefits',
  'Bonus',
  'Vacation',
  'Taxes and Benefits',
  'Total Labor',
];

// split into two halves
const mid = Math.ceil(labels.length / 2);
const group1 = labels.slice(0, mid);
const group2 = labels.slice(mid);

export default function LaborChart({ rows }) {
  if (!rows?.length) return null;

  // find header row and indexes
  const headerRow = rows.find(r => r[0] === 'Ledger Account');
  if (!headerRow) return null;
  const actualIdx = headerRow.findIndex(c => typeof c === 'string' && /actual/i.test(c));
  const priorIdx  = headerRow.findIndex(c => typeof c === 'string' && /prior year/i.test(c));
  if (actualIdx < 0 || priorIdx < 0) return null;

  // prepare table data
  const makeData = labelsList =>
    labelsList.map((label, i) => {
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

  const data1 = useMemo(() => makeData(group1), [rows]);
  const data2 = useMemo(() => makeData(group2), [rows]);

  const columns = [
    { title: 'Labor Category', dataIndex: 'label', key: 'label' },
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
        <Card title="Labor vs Prior Year (Part 1)" size="small">
          <Table
            dataSource={data1}
            columns={columns}
            pagination={false}
            size="small"
            scroll={{ x: 'max-content' }}
          />
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card title="Labor vs Prior Year (Part 2)" size="small">
          <Table
            dataSource={data2}
            columns={columns}
            pagination={false}
            size="small"
            scroll={{ x: 'max-content' }}
          />
        </Card>
      </Col>
    </Row>
  );
}

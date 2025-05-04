import React, { useMemo } from 'react';
import { Card, Table } from 'antd';

const fixedCostItems = [
  'Rent - MIN',
  'Rent - Storage',
  'Rent - Percent',
  'Rent - Other',
  'Rent - Deferred Preopening',
  'Insurance',
  'Taxes',
  'License and Fees',
  'Amortization',
  'Depreciation',
];

export default function FixedCostsChart({ rows }) {
  if (!rows?.length) return null;

  const headerRow = rows.find(r => r[0] === 'Ledger Account');
  if (!headerRow) return null;

  const actualIdx = headerRow.findIndex(c => typeof c === 'string' && /actual/i.test(c));
  const priorIdx  = headerRow.findIndex(c => typeof c === 'string' && /prior year/i.test(c));
  if (actualIdx < 0 || priorIdx < 0) return null;

  const data = useMemo(() =>
    fixedCostItems.map((label, i) => {
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
    }), [rows]
  );

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
        const { diff } = record;
        const color = diff <= 0 ? 'green' : 'red';
        return <span style={{ color }}>{diff.toLocaleString()}</span>;
      },
    },
  ];

  return (
    <Card title="Fixed Costs vs Prior Year" size="small">
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        size="small"
      />
    </Card>
  );
}

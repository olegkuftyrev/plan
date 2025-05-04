// src/components/FixedCosts.jsx
import React from 'react';
import { Table } from 'antd';

const labels = [
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
  'Total Fixed Cost',
  'Restaurant Contribution',
  'Cashflow',
];

export default function FixedCosts({ rows }) {
  if (!rows?.length) return null;

  // 1) найти строку заголовков
  const headerRow = rows.find(r => r[0] === 'Ledger Account');
  if (!headerRow) return null;

  // 2) колонки: первая – Fixed Costs, остальные – из headerRow
  const columns = [
    { title: 'Fixed Costs', dataIndex: 'label', key: 'label' },
    ...headerRow.slice(1).map((title, idx) => ({
      title,
      dataIndex: `col${idx + 1}`,
      key: `col${idx + 1}`,
      align: 'right',
      render: v => (v != null ? v.toLocaleString() : '-'),
    })),
  ];

  // 3) собрать dataSource
  const dataSource = labels.map((label, i) => {
    const row = rows.find(r => r[0] === label) || [];
    const record = { key: i, label };
    headerRow.slice(1).forEach((_, idx) => {
      record[`col${idx + 1}`] = row[idx + 1];
    });
    return record;
  });

  // 4) отрисовать таблицу с горизонтальной прокруткой
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        size="small"
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
}

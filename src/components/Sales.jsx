// src/components/Sales.jsx
import React from 'react';
import { Table } from 'antd';

const labels = [
  'Food Sales',
  'Drink Sales',
  'Retail Sales',
  'Gross Sales',
  'Promotions',
  'Employee Meals',
  '20% Emp Discount',
  'Coupons/Promotions',
  'Net Sales',
];

export default function Sales({ rows }) {
  if (!rows?.length) return null;

  // находим headerRow и строим columns, dataSource...
  const headerRow = rows.find(r => r[0] === 'Ledger Account');
  if (!headerRow) return null;

  const columns = [
    { title: 'Sales', dataIndex: 'label', key: 'label' },
    ...headerRow.slice(1).map((title, idx) => ({
      title,
      dataIndex: `col${idx + 1}`,
      key: idx + 1,
      align: 'right',
      render: v => (v != null ? v : '-'),
    })),
  ];

  const dataSource = labels.map((label, i) => {
    const row = rows.find(r => r[0] === label) || [];
    const record = { key: i, label };
    headerRow.slice(1).forEach((_, idx) => {
      record[`col${idx + 1}`] = row[idx + 1];
    });
    return record;
  });

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

// src/components/COGS.jsx
import React from 'react';
import { Table } from 'antd';

const labels = [
  'Grocery',
  'Meat',
  'Produce',
  'Sea Food',
  'Drinks',
  'Paper Goods',
  'Other',
  'Cost of Goods Sold',
];

export default function COGS({ rows }) {
  if (!rows?.length) return null;

  // Найдём строку заголовков
  const headerRow = rows.find(r => r[0] === 'Ledger Account');
  if (!headerRow) return null;

  // Колонки: первая — Cost of Sales, остальные — из headerRow (без «Difference»)
  const columns = [
    { title: 'Cost of Sales', dataIndex: 'label', key: 'label' },
    ...headerRow.slice(1).map((title, idx) => ({
      title,
      dataIndex: `col${idx + 1}`,
      key: `col${idx + 1}`,
      align: 'right',
      render: v => (v != null ? v.toLocaleString() : '-'),
    })),
  ];

  // Данные: по каждой метке вытаскиваем соответствующие значения
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

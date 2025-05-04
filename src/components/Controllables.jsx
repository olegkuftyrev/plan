// src/components/Controllables.jsx
import React from 'react';
import { Table } from 'antd';

const labels = [
  'Third Party Delivery Fee',
  'Credit Card Fees',
  'Broadband',
  'Electricity',
  'Gas',
  'Telephone',
  'Waste Disposal',
  'Water',
  'Computer Software Expense',
  'Office and Computer Supplies',
  'Education and Training Other',
  'Recruitment',
  'Professional Services',
  'Travel Expenses',
  'Bank Fees',
  'Dues and Subscriptions',
  'Moving and Relocation Expenses',
  'Other Expenses',
  'Postage and Courier Service',
  'Repairs',
  'Maintenance',
  'Restaurant Expenses',
  'Restaurant Supplies',
  'Total Controllables',
  'Profit Before Adv',
  'Advertising',
  'Corporate Advertising',
  'Media',
  'Local Store Marketing',
  'Grand Opening',
  'Lease Marketing',
  'Advertising',
  'Controllable Profit',
];

export default function Controllables({ rows }) {
  if (!rows?.length) return null;

  // 1) Найти строку заголовков
  const headerRow = rows.find(r => r[0] === 'Ledger Account');
  if (!headerRow) return null;

  // 2) Сформировать колонки: первая — «Controllables», остальные — из headerRow
  const columns = [
    { title: 'Controllables', dataIndex: 'label', key: 'label' },
    ...headerRow.slice(1).map((title, idx) => ({
      title,
      dataIndex: `col${idx + 1}`,
      key: `col${idx + 1}`,
      align: 'right',
      render: v => (v != null ? v.toLocaleString() : '-'),
    })),
  ];

  // 3) Собрать dataSource по списку labels
  const dataSource = labels.map((label, i) => {
    const row = rows.find(r => r[0] === label) || [];
    const record = { key: i, label };
    headerRow.slice(1).forEach((_, idx) => {
      record[`col${idx + 1}`] = row[idx + 1];
    });
    return record;
  });

  // 4) Отрисовать таблицу с горизонтальной прокруткой
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

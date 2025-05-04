// src/components/Labor.jsx
import React from 'react';
import { Table } from 'antd';

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

export default function Labor({ rows }) {
  if (!rows?.length) return null;

  // найти строку с заголовками
  const headerRow = rows.find(r => r[0] === 'Ledger Account');
  if (!headerRow) return null;

  // колонки: первая — «Labor», остальные из headerRow
  const columns = [
    { title: 'Labor', dataIndex: 'label', key: 'label' },
    ...headerRow.slice(1).map((title, idx) => ({
      title,
      dataIndex: `col${idx + 1}`,
      key: `col${idx + 1}`,
      align: 'right',
      render: v => (v != null ? v.toLocaleString() : '-'),
    })),
  ];

  // формируем dataSource по списку labels
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

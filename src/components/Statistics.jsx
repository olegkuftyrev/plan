// src/components/Statistics.jsx
import React from 'react';
import { Table } from 'antd';

const labels = [
  'Sales Data',
  'Total Transactions',
  'Check Avg - Net',
  'Fundraising Events Sales',
  'Virtual Fundraising Sales',
  'Catering Sales',
  'Panda Digital Sales',
  '3rd Party Digital Sales',
  'Reward Redemptions',
  '', // blank row
  'Daypart & Sales Channel %',
  'Breakfast %',
  'Lunch %',
  'Afternoon %',
  'Evening %',
  'Dinner %',
  'Dine In %',
  'Take Out %',
  'Drive Thru %',
  '3rd Party Digital %',
  'Panda Digital %',
  'In Store Catering %',
  '', // blank row
  'Labor Data',
  'Direct Labor Hours Total',
  'Average Hourly Wage',
  'Direct Labor Hours',
  'Overtime Hours',
  'Training Hours',
  'Guaranteed Hours',
  'Management Hours',
  'Direct Hours Productivity',
  'Total Hours Productivity',
  'Direct Hours Transaction Productivity',
  'Total Hours Transaction Productivity',
  'Management Headcount',
  'Assistant Manager Headcount',
  'Chef Headcount',
  '', // blank row
  'PSA - Per Store Average',
  'Store Period',
  'PSA - Transactions',
  'PSA - Net Sales',
  'PSA - Total Labor',
  'PSA - Controllables',
  'PSA - Control Profit',
  'PSA - Fixed Costs',
  'PSA - Rests Contribution',
  'PSA - Cash Flow',
];

export default function Statistics({ rows }) {
  if (!rows?.length) return null;

  // 1) Find header row
  const headerRow = rows.find(r => r[0] === 'Ledger Account');
  if (!headerRow) return null;

  // 2) Build columns
  const columns = [
    { title: 'Statistics', dataIndex: 'label', key: 'label' },
    ...headerRow.slice(1).map((title, idx) => ({
      title,
      dataIndex: `col${idx + 1}`,
      key: `col${idx + 1}`,
      align: 'right',
      render: v => (v != null ? v.toLocaleString() : '-'),
    })),
  ];

  // 3) Build dataSource, including blank labels as separator rows
  const dataSource = labels.map((label, i) => {
    const record = { key: i, label };
    if (label) {
      const row = rows.find(r => r[0] === label) || [];
      headerRow.slice(1).forEach((_, idx) => {
        record[`col${idx + 1}`] = row[idx + 1];
      });
    }
    return record;
  });

  // 4) Render table with horizontal scroll
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        size="small"
        showHeader
        scroll={{ x: 'max-content' }}
        rowClassName={(record) => !record.label && 'table-separator-row'}
      />
    </div>
  );
}

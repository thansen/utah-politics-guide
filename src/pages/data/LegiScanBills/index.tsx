import type { ActionType } from '@ant-design/pro-components';
import {
  PageContainer,
  type ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Input, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import {
  fetchMasterList,
  type LegiScanBillSummary,
  searchBills,
} from '@/services/utah-data';

const STATUS_COLORS: Record<number, string> = {
  1: 'default', // Introduced
  2: 'processing', // Engrossed
  3: 'processing', // Enrolled
  4: 'success', // Passed
  5: 'error', // Vetoed
  6: 'warning', // Failed
};

const columns: ProColumns<LegiScanBillSummary>[] = [
  {
    title: 'Bill',
    dataIndex: 'number',
    width: 120,
    render: (_, record) => (
      <a onClick={() => history.push(`/data/legiscan-bills/${record.bill_id}`)}>
        {record.number}
      </a>
    ),
  },
  {
    title: 'Title',
    dataIndex: 'title',
    ellipsis: true,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: 140,
    render: (_, record) => (
      <Tag color={STATUS_COLORS[record.status] || 'default'}>
        {record.status_desc || `Status ${record.status}`}
      </Tag>
    ),
  },
  {
    title: 'Last Action',
    dataIndex: 'last_action',
    ellipsis: true,
    width: 300,
  },
  {
    title: 'Last Action Date',
    dataIndex: 'last_action_date',
    width: 140,
    sorter: (a, b) =>
      (a.last_action_date ?? '').localeCompare(b.last_action_date ?? ''),
  },
];

export default function LegiScanBills() {
  const actionRef = useRef<ActionType>(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <PageContainer content="Utah bills from LegiScan — current session.">
      <ProTable<LegiScanBillSummary>
        actionRef={actionRef}
        rowKey="bill_id"
        headerTitle="Utah Bills (LegiScan)"
        columns={columns}
        search={false}
        toolbar={{
          search: (
            <Input.Search
              placeholder="Search bills..."
              allowClear
              onSearch={(value) => {
                setSearchQuery(value);
                actionRef.current?.reload();
              }}
              style={{ width: 300 }}
            />
          ),
        }}
        request={async () => {
          if (searchQuery) {
            return searchBills(searchQuery);
          }
          return fetchMasterList();
        }}
        pagination={{
          defaultPageSize: 50,
          showSizeChanger: true,
        }}
      />
    </PageContainer>
  );
}

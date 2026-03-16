import type { ActionType } from '@ant-design/pro-components';
import {
  PageContainer,
  type ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { history, useSearchParams } from '@umijs/max';
import { Select, Space, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import {
  fetchBillList,
  fetchPassedBills,
  type UtahBillSummary,
} from '@/services/utah-data';

const SESSIONS = [
  { label: '2025 General Session', value: '2025GS' },
  { label: '2024 General Session', value: '2024GS' },
  { label: '2024 Special Session 1', value: '2024S1' },
  { label: '2023 General Session', value: '2023GS' },
  { label: '2022 General Session', value: '2022GS' },
];

const columns: ProColumns<UtahBillSummary>[] = [
  {
    title: 'Bill',
    dataIndex: 'bill',
    width: 120,
    render: (_, record) => (
      <a
        onClick={() =>
          history.push(`/data/bills/${record._session}/${record.bill}`)
        }
      >
        {record.bill}
      </a>
    ),
  },
  {
    title: 'Short Title',
    dataIndex: 'shorttitle',
    ellipsis: true,
  },
  {
    title: 'Sponsor',
    dataIndex: 'sponsor',
    width: 180,
    ellipsis: true,
  },
  {
    title: 'Floor Sponsor',
    dataIndex: 'floor_sponsor',
    width: 180,
    ellipsis: true,
    hideInTable: true,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: 160,
    render: (_, record) => {
      const s = record.status || '';
      return s ? <Tag>{s}</Tag> : '-';
    },
  },
  {
    title: 'Last Action',
    dataIndex: 'last_action',
    ellipsis: true,
  },
  {
    title: 'Last Action Date',
    dataIndex: 'last_action_date',
    width: 180,
    sorter: (a, b) =>
      (a.last_action_date ?? '').localeCompare(b.last_action_date ?? ''),
  },
];

export default function UtahLegBills() {
  const [searchParams] = useSearchParams();
  const [session, setSession] = useState(
    searchParams.get('session') || '2025GS',
  );
  const [tab, setTab] = useState<'all' | 'passed'>('all');
  const actionRef = useRef<ActionType>(null);

  const handleSessionChange = (value: string) => {
    setSession(value);
    history.replace(`/data/bills?session=${value}`);
    actionRef.current?.reload();
  };

  return (
    <PageContainer
      content="Browse all bills from the Utah Legislature by session."
      tabActiveKey={tab}
      onTabChange={(key) => {
        setTab(key as 'all' | 'passed');
        actionRef.current?.reload();
      }}
      tabList={[
        { key: 'all', tab: 'All Bills' },
        { key: 'passed', tab: 'Passed Bills' },
      ]}
    >
      <ProTable<UtahBillSummary>
        actionRef={actionRef}
        rowKey="bill"
        headerTitle={
          <Space>
            <span>Session:</span>
            <Select
              value={session}
              onChange={handleSessionChange}
              options={SESSIONS}
              style={{ width: 240 }}
            />
          </Space>
        }
        columns={columns}
        search={false}
        request={async () => {
          const result =
            tab === 'passed'
              ? await fetchPassedBills(session)
              : await fetchBillList(session);
          // Tag each row with session for navigation
          const data = result.data.map((b) => ({ ...b, _session: session }));
          return { ...result, data };
        }}
        pagination={{
          defaultPageSize: 50,
          showSizeChanger: true,
        }}
      />
    </PageContainer>
  );
}

import type { ActionType } from '@ant-design/pro-components';
import {
  PageContainer,
  type ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Select, Space, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import {
  fetchSessionList,
  fetchSessionPeople,
  type LegiScanLegislator,
  type LegiScanSession,
} from '@/services/utah-data';

const PARTY_COLORS: Record<string, string> = {
  R: 'red',
  D: 'blue',
  I: 'gold',
  L: 'orange',
};

const columns: ProColumns<LegiScanLegislator>[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    render: (_, record) => (
      <a onClick={() => history.push(`/data/legislators/${record.people_id}`)}>
        {record.name}
      </a>
    ),
  },
  {
    title: 'Party',
    dataIndex: 'party',
    width: 100,
    filters: [
      { text: 'Republican', value: 'R' },
      { text: 'Democrat', value: 'D' },
      { text: 'Independent', value: 'I' },
    ],
    onFilter: (value, record) => record.party === value,
    render: (_, record) => (
      <Tag color={PARTY_COLORS[record.party] || 'default'}>{record.party}</Tag>
    ),
  },
  {
    title: 'Role',
    dataIndex: 'role',
    width: 120,
    filters: [
      { text: 'Representative', value: 'Rep' },
      { text: 'Senator', value: 'Sen' },
    ],
    onFilter: (value, record) => record.role?.includes(String(value)),
  },
  {
    title: 'District',
    dataIndex: 'district',
    width: 100,
    sorter: (a, b) => {
      const na = parseInt(a.district, 10) || 0;
      const nb = parseInt(b.district, 10) || 0;
      return na - nb;
    },
  },
];

export default function LegiScanLegislators() {
  const actionRef = useRef<ActionType>(null);
  const [sessions, setSessions] = useState<LegiScanSession[]>([]);
  const [sessionId, setSessionId] = useState<number | null>(null);

  useEffect(() => {
    fetchSessionList().then((list) => {
      setSessions(list);
      if (list.length > 0) {
        // Default to most recent session
        const sorted = [...list].sort((a, b) => b.year_start - a.year_start);
        setSessionId(sorted[0].session_id);
      }
    });
  }, []);

  useEffect(() => {
    if (sessionId) actionRef.current?.reload();
  }, [sessionId]);

  return (
    <PageContainer content="Utah legislators from LegiScan by session.">
      <ProTable<LegiScanLegislator>
        actionRef={actionRef}
        rowKey="people_id"
        headerTitle={
          <Space>
            <span>Session:</span>
            <Select
              value={sessionId}
              onChange={setSessionId}
              style={{ width: 300 }}
              loading={sessions.length === 0}
              options={sessions
                .sort((a, b) => b.year_start - a.year_start)
                .map((s) => ({
                  label: s.session_title || s.session_name,
                  value: s.session_id,
                }))}
            />
          </Space>
        }
        columns={columns}
        search={false}
        request={async () => {
          if (!sessionId) return { data: [], success: true, total: 0 };
          return fetchSessionPeople(sessionId);
        }}
        pagination={{
          defaultPageSize: 100,
          showSizeChanger: true,
        }}
      />
    </PageContainer>
  );
}

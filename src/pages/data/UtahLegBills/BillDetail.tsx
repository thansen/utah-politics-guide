import { PageContainer } from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import {
  Card,
  Descriptions,
  Empty,
  Spin,
  Tag,
  Timeline,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import {
  type UtahBillDetail as BillData,
  fetchBillDetail,
} from '@/services/utah-data';

const { Text, Paragraph } = Typography;

export default function BillDetail() {
  const { session, bill } = useParams<{ session: string; bill: string }>();
  const [data, setData] = useState<BillData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session || !bill) return;
    setLoading(true);
    fetchBillDetail(session, bill)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session, bill]);

  if (loading) {
    return (
      <PageContainer>
        <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />
      </PageContainer>
    );
  }

  if (!data) {
    return (
      <PageContainer>
        <Empty description="Bill not found" />
      </PageContainer>
    );
  }

  // The Utah Legislature API uses camelCase field names; normalize to what the UI expects
  const raw = data as any;
  const billData = {
    ...raw,
    bill: raw.billNumber ?? raw.billNumberShort ?? raw.bill ?? '',
    shorttitle: raw.shortTitle ?? raw.shorttitle ?? '',
    longtitle: raw.generalProvisions ?? raw.longtitle ?? raw.title ?? '',
    sponsor: raw.primeSponsorName ?? raw.sponsor ?? '',
    floor_sponsor: raw.floorSponsorName ?? raw.floor_sponsor ?? '',
    last_action: raw.lastAction ?? raw.last_action ?? '',
    last_action_date: raw.lastActionDate ?? raw.last_action_date ?? '',
    status: raw.status ?? '',
  };
  const sponsors =
    raw.sponsors ?? (billData.sponsor ? [{ name: billData.sponsor }] : []);
  const rawHistory: any[] =
    raw.actionHistoryList ?? raw.history ?? raw.actions ?? [];
  const historyItems: Array<{ date: string; action: string }> = rawHistory.map(
    (h: any) => ({
      date: h.actionDate ?? h.date ?? '',
      action: h.action ?? h.description ?? '',
    }),
  );

  return (
    <PageContainer
      header={{
        title: `${bill} — ${session}`,
        breadcrumb: {
          items: [
            {
              title: (
                <a onClick={() => history.push('/data/bills')}>
                  UT Legislature Bills
                </a>
              ),
            },
            { title: `${bill}` },
          ],
        },
      }}
    >
      <Card style={{ marginBottom: 16 }}>
        <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered>
          {billData.bill && (
            <Descriptions.Item label="Bill Number">
              {billData.bill}
            </Descriptions.Item>
          )}
          {billData.shorttitle && (
            <Descriptions.Item label="Short Title" span={2}>
              {billData.shorttitle}
            </Descriptions.Item>
          )}
          {billData.longtitle && (
            <Descriptions.Item label="Full Title" span={3}>
              {billData.longtitle}
            </Descriptions.Item>
          )}
          {billData.sponsor && (
            <Descriptions.Item label="Sponsor">
              {billData.sponsor}
            </Descriptions.Item>
          )}
          {billData.floor_sponsor && (
            <Descriptions.Item label="Floor Sponsor">
              {billData.floor_sponsor}
            </Descriptions.Item>
          )}
          {billData.status && (
            <Descriptions.Item label="Status">
              <Tag color="blue">{billData.status}</Tag>
            </Descriptions.Item>
          )}
          {billData.last_action && (
            <Descriptions.Item label="Last Action" span={2}>
              {billData.last_action}
            </Descriptions.Item>
          )}
          {billData.last_action_date && (
            <Descriptions.Item label="Last Action Date">
              {billData.last_action_date}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {Array.isArray(sponsors) && sponsors.length > 0 && (
        <Card title="Sponsors" style={{ marginBottom: 16 }}>
          {sponsors.map((s: any) => (
            <Tag key={s.name ?? s} style={{ marginBottom: 4 }}>
              {s.name ?? s}
            </Tag>
          ))}
        </Card>
      )}

      {historyItems.length > 0 && (
        <Card title="History">
          <Timeline
            items={[...historyItems].reverse().map((h) => ({
              children: (
                <>
                  <Text strong>{h.date}</Text>
                  <Paragraph style={{ margin: 0 }}>{h.action}</Paragraph>
                </>
              ),
            }))}
          />
        </Card>
      )}

      {/* Render any additional top-level fields as raw JSON if interesting */}
      {billData.tracking_id && (
        <Card title="Raw Data" style={{ marginTop: 16 }}>
          <pre style={{ maxHeight: 400, overflow: 'auto', fontSize: 12 }}>
            {JSON.stringify(billData, null, 2)}
          </pre>
        </Card>
      )}
    </PageContainer>
  );
}

import { PageContainer } from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import {
  Card,
  Col,
  Descriptions,
  Drawer,
  Empty,
  List,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  Timeline,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import {
  type LegiScanBillDetail as BillData,
  fetchBill,
  fetchRollCall,
  type LegiScanRollCall,
} from '@/services/utah-data';

const { Text, Paragraph, Link } = Typography;

const PARTY_COLORS: Record<string, string> = {
  R: 'red',
  D: 'blue',
  I: 'gold',
  L: 'orange',
};

export default function LegiScanBillDetail() {
  const { billId } = useParams<{ billId: string }>();
  const [bill, setBill] = useState<BillData | null>(null);
  const [loading, setLoading] = useState(true);
  const [rollCall, setRollCall] = useState<LegiScanRollCall | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!billId) return;
    setLoading(true);
    fetchBill(Number(billId))
      .then(setBill)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [billId]);

  const openRollCall = async (rollCallId: number) => {
    setDrawerOpen(true);
    setRollCall(null);
    try {
      const data = await fetchRollCall(rollCallId);
      setRollCall(data);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />
      </PageContainer>
    );
  }

  if (!bill) {
    return (
      <PageContainer>
        <Empty description="Bill not found" />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      header={{
        title: `${bill.number} — ${bill.title}`,
        breadcrumb: {
          items: [
            {
              title: (
                <a onClick={() => history.push('/data/legiscan-bills')}>
                  LegiScan Bills
                </a>
              ),
            },
            { title: bill.number },
          ],
        },
      }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          {/* Bill Info */}
          <Card style={{ marginBottom: 16 }}>
            <Descriptions column={{ xs: 1, sm: 2 }} bordered>
              <Descriptions.Item label="Bill Number">
                {bill.number}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={bill.status === 4 ? 'success' : 'default'}>
                  {bill.status_desc || `Status ${bill.status}`}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Title" span={2}>
                {bill.title}
              </Descriptions.Item>
              {bill.description && (
                <Descriptions.Item label="Description" span={2}>
                  {bill.description}
                </Descriptions.Item>
              )}
              {bill.session && (
                <Descriptions.Item label="Session">
                  {bill.session.session_name}
                </Descriptions.Item>
              )}
              {bill.url && (
                <Descriptions.Item label="LegiScan URL">
                  <Link href={bill.url} target="_blank">
                    View on LegiScan
                  </Link>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          {/* History / Timeline */}
          {bill.history && bill.history.length > 0 && (
            <Card title="History" style={{ marginBottom: 16 }}>
              <Timeline
                items={bill.history.map((h) => ({
                  color: h.importance > 0 ? 'blue' : 'gray',
                  children: (
                    <>
                      <Text strong>
                        {h.date} — {h.chamber}
                      </Text>
                      <Paragraph style={{ margin: 0 }}>{h.action}</Paragraph>
                    </>
                  ),
                }))}
              />
            </Card>
          )}

          {/* Votes */}
          {bill.votes && bill.votes.length > 0 && (
            <Card title="Votes" style={{ marginBottom: 16 }}>
              <List
                dataSource={bill.votes}
                renderItem={(vote) => (
                  <List.Item
                    actions={[
                      <a
                        key="view"
                        onClick={() => openRollCall(vote.roll_call_id)}
                      >
                        View Roll Call
                      </a>,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <Text>{vote.desc}</Text>
                          <Tag color={vote.passed ? 'success' : 'error'}>
                            {vote.passed ? 'Passed' : 'Failed'}
                          </Tag>
                        </Space>
                      }
                      description={
                        <Space>
                          <Text type="secondary">{vote.date}</Text>
                          <Text type="secondary">({vote.chamber})</Text>
                          <Tag color="green">Yea: {vote.yea}</Tag>
                          <Tag color="red">Nay: {vote.nay}</Tag>
                          <Tag>NV: {vote.nv}</Tag>
                          <Tag>Absent: {vote.absent}</Tag>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          )}
        </Col>

        <Col xs={24} lg={8}>
          {/* Sponsors */}
          {bill.sponsors && bill.sponsors.length > 0 && (
            <Card title="Sponsors" style={{ marginBottom: 16 }}>
              <List
                size="small"
                dataSource={bill.sponsors}
                renderItem={(s) => (
                  <List.Item>
                    <a
                      onClick={() =>
                        history.push(`/data/legislators/${s.people_id}`)
                      }
                    >
                      {s.name}
                    </a>
                    <Tag
                      color={PARTY_COLORS[s.party] || 'default'}
                      style={{ marginLeft: 8 }}
                    >
                      {s.party}
                    </Tag>
                    {s.sponsor_order === 1 && (
                      <Tag color="blue" style={{ marginLeft: 4 }}>
                        Primary
                      </Tag>
                    )}
                  </List.Item>
                )}
              />
            </Card>
          )}

          {/* Text Versions */}
          {bill.texts && bill.texts.length > 0 && (
            <Card title="Text Versions" style={{ marginBottom: 16 }}>
              <List
                size="small"
                dataSource={bill.texts}
                renderItem={(t) => (
                  <List.Item>
                    <Space direction="vertical" size={0}>
                      <Text strong>{t.type}</Text>
                      <Text type="secondary">{t.date}</Text>
                    </Space>
                    {t.url && (
                      <Link href={t.url} target="_blank">
                        View
                      </Link>
                    )}
                  </List.Item>
                )}
              />
            </Card>
          )}
        </Col>
      </Row>

      {/* Roll Call Drawer */}
      <Drawer
        title="Roll Call Detail"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={600}
      >
        {!rollCall ? (
          <Spin />
        ) : (
          <>
            <Descriptions
              column={2}
              bordered
              size="small"
              style={{ marginBottom: 16 }}
            >
              <Descriptions.Item label="Description">
                {rollCall.desc}
              </Descriptions.Item>
              <Descriptions.Item label="Date">
                {rollCall.date}
              </Descriptions.Item>
              <Descriptions.Item label="Chamber">
                {rollCall.chamber}
              </Descriptions.Item>
              <Descriptions.Item label="Passed">
                <Tag color={rollCall.passed ? 'success' : 'error'}>
                  {rollCall.passed ? 'Yes' : 'No'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Yea">{rollCall.yea}</Descriptions.Item>
              <Descriptions.Item label="Nay">{rollCall.nay}</Descriptions.Item>
            </Descriptions>
            {rollCall.votes && (
              <Table
                size="small"
                dataSource={rollCall.votes}
                rowKey="people_id"
                pagination={false}
                columns={[
                  {
                    title: 'Legislator',
                    dataIndex: 'people_id',
                    render: (id: number) => (
                      <a
                        onClick={() => history.push(`/data/legislators/${id}`)}
                      >
                        #{id}
                      </a>
                    ),
                  },
                  {
                    title: 'Vote',
                    dataIndex: 'vote_text',
                    render: (text: string) => {
                      const colors: Record<string, string> = {
                        Yea: 'green',
                        Nay: 'red',
                        'Not Voting': 'default',
                        Absent: 'orange',
                      };
                      return (
                        <Tag color={colors[text] || 'default'}>{text}</Tag>
                      );
                    },
                  },
                ]}
              />
            )}
          </>
        )}
      </Drawer>
    </PageContainer>
  );
}

import {
  ApiOutlined,
  DatabaseOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Card, Col, List, Row, Space, Statistic, Tag, Typography } from 'antd';
import React from 'react';

const { Paragraph, Text } = Typography;

const sources = [
  {
    key: 'utah-legislature',
    name: 'Utah Legislature API',
    entity: 'Utah State Legislature',
    icon: <DatabaseOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
    description:
      'Bills, legislators, committees, roll-call votes, session data. Updated daily.',
    endpoints: 7,
    auth: 'Developer Token',
    cost: 'Free',
    path: '/sources/utah-legislature',
    color: '#1890ff',
  },
  {
    key: 'legiscan',
    name: 'LegiScan API',
    entity: 'LegiScan LLC',
    icon: <ApiOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
    description:
      'Nationwide legislative data — bills, sponsors, text, amendments, roll calls. Consistent schema across states.',
    endpoints: 8,
    auth: 'API Key',
    cost: 'Free tier (30k/month)',
    path: '/sources/legiscan',
    color: '#52c41a',
  },
  {
    key: 'open-data',
    name: 'Utah Open Data Portal',
    entity: 'State of Utah',
    icon: <GlobalOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
    description:
      'Hundreds of state datasets — budgets, demographics, census, agency data. Socrata SODA API.',
    endpoints: 4,
    auth: 'None (optional token)',
    cost: 'Free',
    path: '/sources/open-data',
    color: '#722ed1',
  },
  {
    key: 'ugrc',
    name: 'UGRC GIS API',
    entity: 'Utah Geospatial Resource Center',
    icon: <EnvironmentOutlined style={{ fontSize: 24, color: '#fa8c16' }} />,
    description:
      'Geocoding, legislative districts, precinct boundaries, census layers, address lookup.',
    endpoints: 3,
    auth: 'API Key',
    cost: 'Free',
    path: '/sources/ugrc',
    color: '#fa8c16',
  },
];

export default function Dashboard() {
  return (
    <PageContainer
      content={
        <Paragraph>
          Explore and test Utah public data APIs. Each source page lets you
          select endpoints, fill in parameters, send requests, and inspect the
          responses — JSON viewer, raw output, and table view.
        </Paragraph>
      }
    >
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="API Sources"
              value={sources.length}
              prefix={<ApiOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total Endpoints"
              value={sources.reduce((sum, s) => sum + s.endpoints, 0)}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Free Sources"
              value={sources.length}
              suffix={`/ ${sources.length}`}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Auth Required"
              value={
                sources.filter((s) => s.auth !== 'None (optional token)').length
              }
            />
          </Card>
        </Col>
      </Row>

      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
        dataSource={sources}
        renderItem={(source) => (
          <List.Item>
            <Card
              hoverable
              onClick={() => history.push(source.path)}
              style={{ borderLeft: `3px solid ${source.color}` }}
            >
              <Card.Meta
                avatar={source.icon}
                title={
                  <Space>
                    {source.name}
                    <Tag color={source.color}>{source.endpoints} endpoints</Tag>
                  </Space>
                }
                description={
                  <>
                    <Text type="secondary">{source.entity}</Text>
                    <Paragraph style={{ marginTop: 8, marginBottom: 8 }}>
                      {source.description}
                    </Paragraph>
                    <Space>
                      <Tag>{source.auth}</Tag>
                      <Tag color="green">{source.cost}</Tag>
                    </Space>
                  </>
                }
              />
            </Card>
          </List.Item>
        )}
      />
    </PageContainer>
  );
}

import { DatabaseOutlined, SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import {
  Card,
  Col,
  Empty,
  Input,
  List,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import {
  type CatalogEntry,
  FEATURED_DATASETS,
  searchCatalog,
} from '@/services/utah-data';

const { Text } = Typography;

export default function OpenDataBrowser() {
  const [searchResults, setSearchResults] = useState<CatalogEntry[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearched(false);
      return;
    }
    setSearching(true);
    setSearched(true);
    try {
      const result = await searchCatalog(query);
      setSearchResults(result.data);
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  return (
    <PageContainer content="Browse Utah Open Data Portal datasets.">
      {/* Featured Datasets */}
      <Card title="Featured Datasets" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          {FEATURED_DATASETS.map((ds) => (
            <Col xs={24} sm={12} lg={6} key={ds.id}>
              <Card
                hoverable
                size="small"
                onClick={() => history.push(`/data/open-data/${ds.id}`)}
                style={{ height: '100%' }}
              >
                <Space direction="vertical" size={4}>
                  <Space>
                    <DatabaseOutlined />
                    <Text strong>{ds.name}</Text>
                  </Space>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {ds.description}
                  </Text>
                  <Tag>{ds.category}</Tag>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {ds.id}
                  </Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Search */}
      <Card title="Search Datasets" style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search for datasets (e.g., election, budget, crime, population)..."
          enterButton={
            <>
              <SearchOutlined /> Search
            </>
          }
          size="large"
          allowClear
          onSearch={handleSearch}
          loading={searching}
          style={{ maxWidth: 600 }}
        />
      </Card>

      {/* Search Results */}
      {searching && (
        <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />
      )}

      {!searching && searched && searchResults.length === 0 && (
        <Empty description="No datasets found" />
      )}

      {!searching && searchResults.length > 0 && (
        <Card title={`Search Results (${searchResults.length})`}>
          <List
            dataSource={searchResults}
            renderItem={(entry) => (
              <List.Item
                key={entry.resource?.id}
                actions={[
                  <a
                    key="view"
                    onClick={() =>
                      history.push(`/data/open-data/${entry.resource?.id}`)
                    }
                  >
                    View Data
                  </a>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <a
                      onClick={() =>
                        history.push(`/data/open-data/${entry.resource?.id}`)
                      }
                    >
                      {entry.resource?.name}
                    </a>
                  }
                  description={
                    <Space direction="vertical" size={4}>
                      <Text type="secondary">
                        {entry.resource?.description?.slice(0, 200)}
                        {(entry.resource?.description?.length ?? 0) > 200
                          ? '...'
                          : ''}
                      </Text>
                      <Space size={4}>
                        <Tag>{entry.resource?.type}</Tag>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          ID: {entry.resource?.id}
                        </Text>
                        {entry.classification?.domain_tags?.map((t) => (
                          <Tag key={t} color="blue">
                            {t}
                          </Tag>
                        ))}
                      </Space>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}
    </PageContainer>
  );
}

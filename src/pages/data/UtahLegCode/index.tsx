import { PageContainer } from '@ant-design/pro-components';
import { Card, Collapse, Empty, List, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  fetchCodeSection,
  fetchCodeTitles,
  type UtahCodeSection,
  type UtahCodeTitle,
} from '@/services/utah-data';

const { Text } = Typography;

function SectionViewer({ sectionId }: { sectionId: string }) {
  const [data, setData] = useState<UtahCodeSection | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchCodeSection(sectionId)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [sectionId]);

  if (loading) return <Spin size="small" />;
  if (!data) return <Empty description="No data" />;

  // The code section response may contain chapters/parts/sections
  const sections = data.sections ?? data.chapters ?? data.parts;
  if (Array.isArray(sections) && sections.length > 0) {
    return (
      <List
        size="small"
        dataSource={sections}
        renderItem={(item: any) => (
          <List.Item>
            <Text strong>{item.number ?? item.title_number}</Text>{' '}
            <Text>{item.title ?? item.catchline ?? item.name}</Text>
          </List.Item>
        )}
      />
    );
  }

  // Fallback: render as raw JSON
  return (
    <pre style={{ maxHeight: 300, overflow: 'auto', fontSize: 12 }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

export default function UtahLegCode() {
  const [titles, setTitles] = useState<UtahCodeTitle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCodeTitles()
      .then((result) => setTitles(result.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageContainer content="Browse Utah Code titles and sections.">
      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />
      ) : titles.length === 0 ? (
        <Empty />
      ) : (
        <Card>
          <Collapse
            accordion
            items={titles.map((t) => ({
              key: t.number,
              label: (
                <>
                  <Text strong>Title {t.number}</Text> — {t.title}
                </>
              ),
              children: <SectionViewer sectionId={t.number} />,
            }))}
          />
        </Card>
      )}
    </PageContainer>
  );
}

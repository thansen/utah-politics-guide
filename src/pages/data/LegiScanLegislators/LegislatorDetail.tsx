import { PageContainer } from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { Card, Descriptions, Empty, Spin, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { fetchPerson, type LegiScanPerson } from '@/services/utah-data';

const PARTY_COLORS: Record<string, string> = {
  R: 'red',
  D: 'blue',
  I: 'gold',
  L: 'orange',
};

export default function LegislatorDetail() {
  const { personId } = useParams<{ personId: string }>();
  const [person, setPerson] = useState<LegiScanPerson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!personId) return;
    setLoading(true);
    fetchPerson(Number(personId))
      .then(setPerson)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [personId]);

  if (loading) {
    return (
      <PageContainer>
        <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />
      </PageContainer>
    );
  }

  if (!person) {
    return (
      <PageContainer>
        <Empty description="Legislator not found" />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      header={{
        title: person.name,
        breadcrumb: {
          items: [
            {
              title: (
                <a onClick={() => history.push('/data/legislators')}>
                  Legislators
                </a>
              ),
            },
            { title: person.name },
          ],
        },
      }}
    >
      <Card>
        <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered>
          <Descriptions.Item label="Name">{person.name}</Descriptions.Item>
          <Descriptions.Item label="Party">
            <Tag color={PARTY_COLORS[person.party] || 'default'}>
              {person.party}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Role">{person.role}</Descriptions.Item>
          <Descriptions.Item label="District">
            {person.district}
          </Descriptions.Item>
          <Descriptions.Item label="State">{person.state}</Descriptions.Item>
          {person.first_name && (
            <Descriptions.Item label="First Name">
              {person.first_name}
            </Descriptions.Item>
          )}
          {person.last_name && (
            <Descriptions.Item label="Last Name">
              {person.last_name}
            </Descriptions.Item>
          )}
          {person.middle_name && (
            <Descriptions.Item label="Middle Name">
              {person.middle_name}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* Full raw data for exploration */}
      <Card title="Full API Response" style={{ marginTop: 16 }}>
        <pre style={{ maxHeight: 400, overflow: 'auto', fontSize: 12 }}>
          {JSON.stringify(person, null, 2)}
        </pre>
      </Card>
    </PageContainer>
  );
}

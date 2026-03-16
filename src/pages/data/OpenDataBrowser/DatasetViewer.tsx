import {
  PageContainer,
  type ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { Alert, Card, Descriptions, Empty, Spin, Tag, Typography } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import {
  type DatasetMetadata,
  fetchDatasetMetadata,
  queryDataset,
} from '@/services/utah-data';

const { Text } = Typography;

export default function DatasetViewer() {
  const { datasetId } = useParams<{ datasetId: string }>();
  const [metadata, setMetadata] = useState<DatasetMetadata | null>(null);
  const [metaLoading, setMetaLoading] = useState(true);

  useEffect(() => {
    if (!datasetId) return;
    setMetaLoading(true);
    fetchDatasetMetadata(datasetId)
      .then(setMetadata)
      .catch(console.error)
      .finally(() => setMetaLoading(false));
  }, [datasetId]);

  // Build columns from metadata
  const columns: ProColumns<Record<string, any>>[] = useMemo(() => {
    if (!metadata?.columns) return [];
    return metadata.columns
      .filter((c) => !c.fieldName.startsWith(':'))
      .sort((a, b) => a.position - b.position)
      .map((col) => ({
        title: col.name || col.fieldName,
        dataIndex: col.fieldName,
        ellipsis: true,
        tip: col.description,
        valueType:
          col.dataTypeName === 'number' || col.dataTypeName === 'money'
            ? 'digit'
            : col.dataTypeName === 'calendar_date'
              ? 'date'
              : undefined,
      }));
  }, [metadata]);

  const isGeoDataset =
    metadata && columns.length === 0 && metadata.displayType?.includes('map');

  if (!datasetId) {
    return (
      <PageContainer>
        <Empty description="No dataset ID" />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      header={{
        title: metadata?.name || datasetId,
        breadcrumb: {
          items: [
            {
              title: (
                <a onClick={() => history.push('/data/open-data')}>Open Data</a>
              ),
            },
            { title: metadata?.name || datasetId },
          ],
        },
      }}
    >
      {/* Metadata */}
      {metaLoading ? (
        <Card style={{ marginBottom: 16 }}>
          <Spin />
        </Card>
      ) : metadata ? (
        <Card style={{ marginBottom: 16 }}>
          <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small">
            <Descriptions.Item label="Dataset ID">
              {datasetId}
            </Descriptions.Item>
            <Descriptions.Item label="Name">{metadata.name}</Descriptions.Item>
            {metadata.description && (
              <Descriptions.Item label="Description" span={2}>
                {metadata.description}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Columns">
              {metadata.columns?.filter((c) => !c.fieldName.startsWith(':'))
                .length ?? 0}
            </Descriptions.Item>
            {metadata.rowsUpdatedAt && (
              <Descriptions.Item label="Last Updated">
                {new Date(metadata.rowsUpdatedAt * 1000).toLocaleDateString()}
              </Descriptions.Item>
            )}
          </Descriptions>
          {metadata.columns && (
            <div style={{ marginTop: 12 }}>
              <Text type="secondary">Fields: </Text>
              {metadata.columns
                .filter((c) => !c.fieldName.startsWith(':'))
                .map((c) => (
                  <Tag key={c.fieldName} style={{ marginBottom: 4 }}>
                    {c.name || c.fieldName}{' '}
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      ({c.dataTypeName})
                    </Text>
                  </Tag>
                ))}
            </div>
          )}
        </Card>
      ) : null}

      {/* Data Table */}
      {isGeoDataset ? (
        <Alert
          type="info"
          showIcon
          message="Geospatial Dataset"
          description={
            <>
              This dataset contains map/GIS data and cannot be displayed as a
              table. View it on{' '}
              <a
                href={`https://opendata.utah.gov/d/${datasetId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Utah Open Data
              </a>
              .
            </>
          }
        />
      ) : (
        <ProTable<Record<string, any>>
          rowKey={(_, index) => String(index)}
          headerTitle={metadata?.name || 'Dataset'}
          columns={columns.length > 0 ? columns : undefined}
          search={false}
          request={async (params) => {
            const pageSize = params.pageSize || 20;
            const current = params.current || 1;
            return queryDataset(datasetId, {
              limit: pageSize,
              offset: (current - 1) * pageSize,
            });
          }}
          pagination={{
            defaultPageSize: 20,
            showSizeChanger: true,
          }}
        />
      )}
    </PageContainer>
  );
}

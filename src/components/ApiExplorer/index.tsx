import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  SendOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Collapse,
  Descriptions,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import React, { useState } from 'react';

const { Text, Paragraph } = Typography;

export interface EndpointParam {
  name: string;
  label: string;
  type: 'string' | 'number' | 'select';
  required?: boolean;
  default?: string | number;
  options?: { label: string; value: string }[];
  description?: string;
}

export interface Endpoint {
  id: string;
  label: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  params: EndpointParam[];
  description: string;
}

export interface ApiSourceConfig {
  name: string;
  description: string;
  baseUrl: string;
  docsUrl: string;
  authType: string;
  authDescription: string;
  envVar?: string;
  endpoints: Endpoint[];
  buildRequestUrl: (endpoint: Endpoint, params: Record<string, any>) => string;
}

const methodColors: Record<string, string> = {
  GET: 'green',
  POST: 'blue',
  PUT: 'orange',
  DELETE: 'red',
};

function JsonViewer({ data, depth = 0 }: { data: any; depth?: number }) {
  if (data === null) return <Text type="secondary">null</Text>;
  if (data === undefined) return <Text type="secondary">undefined</Text>;
  if (typeof data === 'boolean')
    return <Text style={{ color: '#d46b08' }}>{String(data)}</Text>;
  if (typeof data === 'number')
    return <Text style={{ color: '#1d39c4' }}>{data}</Text>;
  if (typeof data === 'string') {
    if (data.length > 200) {
      return (
        <Text style={{ color: '#389e0d' }}>"{data.slice(0, 200)}..."</Text>
      );
    }
    return <Text style={{ color: '#389e0d' }}>"{data}"</Text>;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return <Text>[]</Text>;
    return (
      <Collapse
        defaultActiveKey={depth < 1 ? ['0'] : []}
        size="small"
        ghost
        items={[
          {
            key: '0',
            label: <Text type="secondary">Array [{data.length} items]</Text>,
            children: (
              <>
                {data.slice(0, 50).map((item) => {
                  const itemKey =
                    typeof item === 'object'
                      ? JSON.stringify(item).substring(0, 50)
                      : String(item);
                  return (
                    <div
                      key={itemKey}
                      style={{
                        paddingLeft: 16,
                        borderLeft: '1px solid #f0f0f0',
                        marginBottom: 4,
                      }}
                    >
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        •{' '}
                      </Text>
                      <JsonViewer data={item} depth={depth + 1} />
                    </div>
                  );
                })}
                {data.length > 50 && (
                  <Text type="secondary" italic>
                    ...and {data.length - 50} more items
                  </Text>
                )}
              </>
            ),
          },
        ]}
      />
    );
  }

  if (typeof data === 'object') {
    const keys = Object.keys(data);
    if (keys.length === 0) return <Text>{'{}'}</Text>;
    return (
      <Collapse
        defaultActiveKey={depth < 1 ? ['0'] : []}
        size="small"
        ghost
        items={[
          {
            key: '0',
            label: (
              <Text type="secondary">{`Object {${keys.length} keys}`}</Text>
            ),
            children: (
              <>
                {keys.map((key) => (
                  <div
                    key={key}
                    style={{
                      paddingLeft: 16,
                      borderLeft: '1px solid #f0f0f0',
                      marginBottom: 4,
                    }}
                  >
                    <Text strong style={{ color: '#531dab' }}>
                      {key}:{' '}
                    </Text>
                    <JsonViewer data={data[key]} depth={depth + 1} />
                  </div>
                ))}
              </>
            ),
          },
        ]}
      />
    );
  }

  return <Text>{String(data)}</Text>;
}

function ResponseTable({ data }: { data: any }) {
  const rows = Array.isArray(data) ? data : [data];
  if (rows.length === 0) return <Text type="secondary">Empty array</Text>;

  const sampleRows = rows.slice(0, 20);
  const allKeys = new Set<string>();
  for (const row of sampleRows) {
    if (row && typeof row === 'object') {
      for (const k of Object.keys(row)) {
        allKeys.add(k);
      }
    }
  }

  const columns = Array.from(allKeys)
    .slice(0, 12)
    .map((key) => ({
      title: key,
      dataIndex: key,
      key,
      ellipsis: true,
      width: 150,
      render: (val: any) => {
        if (val === null || val === undefined)
          return <Text type="secondary">-</Text>;
        if (typeof val === 'object')
          return (
            <Text type="secondary">{JSON.stringify(val).slice(0, 50)}...</Text>
          );
        return String(val);
      },
    }));

  return (
    <Table
      dataSource={rows.slice(0, 100).map((row, i) => ({ ...row, _key: i }))}
      columns={columns}
      rowKey="_key"
      size="small"
      scroll={{ x: 'max-content' }}
      pagination={{ pageSize: 20, showSizeChanger: true }}
    />
  );
}

export default function ApiExplorer({ config }: { config: ApiSourceConfig }) {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>(
    config.endpoints[0]?.id || '',
  );
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    data: any;
    status: number;
    timing: number;
    url: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const endpoint = config.endpoints.find((e) => e.id === selectedEndpoint);

  const handleEndpointChange = (id: string) => {
    setSelectedEndpoint(id);
    form.resetFields();
    setResponse(null);
    setError(null);
    const ep = config.endpoints.find((e) => e.id === id);
    if (ep) {
      const defaults: Record<string, any> = {};
      ep.params.forEach((p) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
      form.setFieldsValue(defaults);
    }
  };

  const handleSend = async () => {
    if (!endpoint) return;
    try {
      await form.validateFields();
    } catch {
      return;
    }

    const params = form.getFieldsValue();
    const url = config.buildRequestUrl(endpoint, params);

    setLoading(true);
    setError(null);
    setResponse(null);

    const start = performance.now();
    try {
      const res = await fetch(url);
      const timing = Math.round(performance.now() - start);
      const contentType = res.headers.get('content-type') || '';
      let data: any;
      if (contentType.includes('json')) {
        data = await res.json();
      } else {
        data = await res.text();
      }
      setResponse({ data, status: res.status, timing, url });
    } catch (err: any) {
      const timing = Math.round(performance.now() - start);
      setError(err.message || 'Request failed');
      setResponse({ data: null, status: 0, timing, url });
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = () => {
    if (response?.url) {
      navigator.clipboard.writeText(response.url);
      message.success('URL copied');
    }
  };

  const copyResponse = () => {
    if (response?.data) {
      navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
      message.success('Response copied');
    }
  };

  return (
    <Space orientation="vertical" style={{ width: '100%' }} size="middle">
      {/* Source info */}
      <Card size="small">
        <Descriptions column={2} size="small">
          <Descriptions.Item label="Base URL">
            <Text code>{config.baseUrl}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Auth">
            {config.authDescription}
          </Descriptions.Item>
          <Descriptions.Item label="Documentation" span={2}>
            <a href={config.docsUrl} target="_blank" rel="noopener noreferrer">
              {config.docsUrl}
            </a>
          </Descriptions.Item>
        </Descriptions>
        {config.envVar && (
          <Alert
            title={`Set ${config.envVar} in .env to use this API`}
            type="info"
            showIcon
            style={{ marginTop: 8 }}
          />
        )}
      </Card>

      {/* Endpoint selector */}
      <Card title="Endpoint" size="small">
        <Select
          value={selectedEndpoint}
          onChange={handleEndpointChange}
          style={{ width: '100%', marginBottom: 16 }}
          options={config.endpoints.map((ep) => ({
            label: (
              <span>
                <Tag color={methodColors[ep.method]} style={{ marginRight: 8 }}>
                  {ep.method}
                </Tag>
                {ep.label}
              </span>
            ),
            value: ep.id,
          }))}
        />
        {endpoint && (
          <>
            <Paragraph type="secondary">{endpoint.description}</Paragraph>
            <Text code>{endpoint.path}</Text>
          </>
        )}
      </Card>

      {/* Parameters */}
      {endpoint && endpoint.params.length > 0 && (
        <Card title="Parameters" size="small">
          <Form form={form} layout="vertical" size="small">
            {endpoint.params.map((param) => (
              <Form.Item
                key={param.name}
                name={param.name}
                label={
                  <span>
                    {param.label}
                    {param.required && <Text type="danger"> *</Text>}
                    {param.description && (
                      <Text
                        type="secondary"
                        style={{ fontSize: 12, marginLeft: 8 }}
                      >
                        {param.description}
                      </Text>
                    )}
                  </span>
                }
                rules={
                  param.required
                    ? [
                        {
                          required: true,
                          message: `${param.label} is required`,
                        },
                      ]
                    : []
                }
                initialValue={param.default}
              >
                {param.type === 'select' && param.options ? (
                  <Select
                    options={param.options}
                    allowClear
                    placeholder={`Select ${param.label}`}
                  />
                ) : param.type === 'number' ? (
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder={`Enter ${param.label}`}
                  />
                ) : (
                  <Input placeholder={`Enter ${param.label}`} />
                )}
              </Form.Item>
            ))}
          </Form>
        </Card>
      )}

      {/* Send button */}
      <Button
        type="primary"
        icon={<SendOutlined />}
        onClick={handleSend}
        loading={loading}
        size="large"
        block
      >
        Send Request
      </Button>

      {/* Response */}
      {(response || error) && (
        <Card
          title="Response"
          size="small"
          extra={
            <Space>
              {response && (
                <>
                  <Tag
                    icon={
                      response.status >= 200 && response.status < 300 ? (
                        <CheckCircleOutlined />
                      ) : (
                        <CloseCircleOutlined />
                      )
                    }
                    color={
                      response.status >= 200 && response.status < 300
                        ? 'success'
                        : 'error'
                    }
                  >
                    {response.status || 'Error'}
                  </Tag>
                  <Tag icon={<ClockCircleOutlined />}>{response.timing}ms</Tag>
                  <Button
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={copyUrl}
                  >
                    URL
                  </Button>
                  {response.data && (
                    <Button
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={copyResponse}
                    >
                      Response
                    </Button>
                  )}
                </>
              )}
            </Space>
          }
        >
          {error && (
            <Alert
              title={error}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
          {response?.url && (
            <Paragraph>
              <Text strong>URL: </Text>
              <Text
                code
                copyable
                style={{ fontSize: 12, wordBreak: 'break-all' }}
              >
                {response.url}
              </Text>
            </Paragraph>
          )}
          {response?.data && (
            <Tabs
              defaultActiveKey="json"
              items={[
                {
                  key: 'json',
                  label: 'JSON',
                  children:
                    typeof response.data === 'string' ? (
                      <Paragraph>
                        <pre
                          style={{
                            maxHeight: 500,
                            overflow: 'auto',
                            fontSize: 12,
                          }}
                        >
                          {response.data}
                        </pre>
                      </Paragraph>
                    ) : (
                      <div style={{ maxHeight: 500, overflow: 'auto' }}>
                        <JsonViewer data={response.data} />
                      </div>
                    ),
                },
                {
                  key: 'raw',
                  label: 'Raw',
                  children: (
                    <pre
                      style={{
                        maxHeight: 500,
                        overflow: 'auto',
                        fontSize: 11,
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {typeof response.data === 'string'
                        ? response.data
                        : JSON.stringify(response.data, null, 2)}
                    </pre>
                  ),
                },
                ...(Array.isArray(response.data) ||
                (typeof response.data === 'object' &&
                  Object.values(response.data).some(Array.isArray))
                  ? [
                      {
                        key: 'table',
                        label: 'Table',
                        children: (
                          <ResponseTable
                            data={
                              Array.isArray(response.data)
                                ? response.data
                                : Object.values(response.data).find(
                                    Array.isArray,
                                  ) || response.data
                            }
                          />
                        ),
                      },
                    ]
                  : []),
              ]}
            />
          )}
        </Card>
      )}
    </Space>
  );
}

import { PageContainer } from '@ant-design/pro-components';
import React from 'react';
import ApiExplorer, { type ApiSourceConfig } from '@/components/ApiExplorer';

const config: ApiSourceConfig = {
  name: 'Utah Open Data Portal',
  description:
    'Hundreds of datasets from Utah state agencies. Powered by Socrata — supports SODA API with SoQL queries for filtering, aggregation, and pagination.',
  baseUrl: 'https://opendata.utah.gov',
  docsUrl: 'https://dev.socrata.com/consumers/getting-started.html',
  authType: 'basic',
  authDescription:
    'API key (Basic Auth) injected via proxy. Higher rate limits enabled automatically.',
  endpoints: [
    {
      id: 'query-dataset',
      label: 'Query Dataset',
      method: 'GET',
      path: '/resource/{dataset_id}.json',
      description:
        'Query any dataset by its 4x4 identifier. Use SoQL parameters to filter and shape results.',
      params: [
        {
          name: 'dataset_id',
          label: 'Dataset ID',
          type: 'select',
          required: true,
          default: 'g4rz-x53h',
          options: [
            {
              label: 'Utah Census Cities 2009-2013 (g4rz-x53h)',
              value: 'g4rz-x53h',
            },
            {
              label: 'Utah Census Counties 2013 (ww3j-23xv)',
              value: 'ww3j-23xv',
            },
            {
              label: 'Utah Senate Districts 2012 (kqnp-uuns)',
              value: 'kqnp-uuns',
            },
            {
              label: 'South SLC Police Crime Data (xdzt-t8fg)',
              value: 'xdzt-t8fg',
            },
          ],
          description: 'Socrata 4x4 dataset identifier',
        },
        {
          name: '$limit',
          label: 'Limit',
          type: 'number',
          default: 10,
          description: 'Max rows to return (default 1000)',
        },
        {
          name: '$offset',
          label: 'Offset',
          type: 'number',
          description: 'Number of rows to skip',
        },
        {
          name: '$where',
          label: 'Where (SoQL)',
          type: 'string',
          description: 'SoQL filter clause (e.g. population > 50000)',
        },
        {
          name: '$select',
          label: 'Select (SoQL)',
          type: 'string',
          description: 'Comma-separated column names to return',
        },
        {
          name: '$order',
          label: 'Order (SoQL)',
          type: 'string',
          description: 'Column to sort by (e.g. name ASC)',
        },
      ],
    },
    {
      id: 'dataset-metadata',
      label: 'Dataset Metadata',
      method: 'GET',
      path: '/api/views/{dataset_id}.json',
      description:
        'Get metadata about a dataset — name, description, columns, update frequency.',
      params: [
        {
          name: 'dataset_id',
          label: 'Dataset ID',
          type: 'select',
          required: true,
          default: 'g4rz-x53h',
          options: [
            {
              label: 'Utah Census Cities 2009-2013 (g4rz-x53h)',
              value: 'g4rz-x53h',
            },
            {
              label: 'Utah Census Counties 2013 (ww3j-23xv)',
              value: 'ww3j-23xv',
            },
            {
              label: 'Utah Senate Districts 2012 (kqnp-uuns)',
              value: 'kqnp-uuns',
            },
          ],
        },
      ],
    },
    {
      id: 'count-dataset',
      label: 'Count Rows',
      method: 'GET',
      path: '/resource/{dataset_id}.json?$select=count(*)',
      description: 'Get total row count for a dataset.',
      params: [
        {
          name: 'dataset_id',
          label: 'Dataset ID',
          type: 'select',
          required: true,
          default: 'g4rz-x53h',
          options: [
            {
              label: 'Utah Census Cities 2009-2013 (g4rz-x53h)',
              value: 'g4rz-x53h',
            },
            {
              label: 'Utah Census Counties 2013 (ww3j-23xv)',
              value: 'ww3j-23xv',
            },
          ],
        },
      ],
    },
    {
      id: 'catalog-search',
      label: 'Search Catalog',
      method: 'GET',
      path: '/api/catalog/v1?q={query}&domains=opendata.utah.gov&limit={limit}',
      description: 'Search the full dataset catalog by keyword.',
      extractions: [
        {
          targetEndpoint: 'query-dataset',
          targetParam: 'dataset_id',
          responsePath: 'results.resource.id',
          label: 'dataset_id from catalog-search',
        },
        {
          targetEndpoint: 'dataset-metadata',
          targetParam: 'dataset_id',
          responsePath: 'results.resource.id',
          label: 'dataset_id from catalog-search',
        },
        {
          targetEndpoint: 'count-dataset',
          targetParam: 'dataset_id',
          responsePath: 'results.resource.id',
          label: 'dataset_id from catalog-search',
        },
      ],
      params: [
        {
          name: 'query',
          label: 'Search Query',
          type: 'string',
          required: true,
          default: 'election',
          description: 'Keywords to search for datasets',
        },
        {
          name: 'limit',
          label: 'Limit',
          type: 'number',
          default: 10,
        },
      ],
    },
  ],
  buildRequestUrl: (endpoint, params) => {
    const { dataset_id, ...queryParams } = params;
    let path = endpoint.path;

    // Replace path params
    if (dataset_id) {
      path = path.replace('{dataset_id}', encodeURIComponent(dataset_id));
    }
    if (params.query) {
      path = path.replace('{query}', encodeURIComponent(params.query));
    }
    if (params.limit) {
      path = path.replace('{limit}', encodeURIComponent(params.limit));
    }

    // For the query-dataset endpoint, append SoQL params
    if (endpoint.id === 'query-dataset') {
      const parts: string[] = [];
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined && value !== '' && key.startsWith('$')) {
          parts.push(`${key}=${encodeURIComponent(String(value))}`);
        }
      }
      if (parts.length > 0) {
        path += (path.includes('?') ? '&' : '?') + parts.join('&');
      }
    }

    return `/api/proxy/open-data${path}`;
  },
};

export default function OpenData() {
  return (
    <PageContainer>
      <ApiExplorer config={config} />
    </PageContainer>
  );
}

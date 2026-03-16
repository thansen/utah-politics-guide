import type { TableResponse, CatalogEntry, DatasetMetadata } from './types';

async function fetchJson(url: string, endpointId: string) {
  const res = await fetch(url, {
    headers: { 'X-Endpoint-Id': endpointId },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

export async function searchCatalog(
  query: string,
  limit = 20,
): Promise<TableResponse<CatalogEntry>> {
  const json = await fetchJson(
    `/api/proxy/open-data/api/catalog/v1?q=${encodeURIComponent(query)}&domains=opendata.utah.gov&limit=${limit}`,
    'catalog-search',
  );
  return {
    data: json?.results ?? [],
    success: true,
    total: json?.resultSetSize ?? 0,
  };
}

export async function queryDataset(
  datasetId: string,
  params: {
    limit?: number;
    offset?: number;
    where?: string;
    select?: string;
    order?: string;
  } = {},
): Promise<TableResponse<Record<string, any>>> {
  const qs = new URLSearchParams();
  if (params.limit != null) qs.set('$limit', String(params.limit));
  if (params.offset != null) qs.set('$offset', String(params.offset));
  if (params.where) qs.set('$where', params.where);
  if (params.select) qs.set('$select', params.select);
  if (params.order) qs.set('$order', params.order);

  const qsStr = qs.toString();
  const url = `/api/proxy/open-data/resource/${datasetId}.json${qsStr ? '?' + qsStr : ''}`;
  const data = await fetchJson(url, 'query-dataset');

  // Fetch total count in parallel-safe way
  const countData = await fetchJson(
    `/api/proxy/open-data/resource/${datasetId}.json?$select=count(*)`,
    'count-dataset',
  );
  const total = parseInt(countData?.[0]?.count ?? countData?.[0]?.count_1 ?? '0', 10);

  return { data: Array.isArray(data) ? data : [], success: true, total };
}

export async function fetchDatasetMetadata(datasetId: string): Promise<DatasetMetadata> {
  return fetchJson(
    `/api/proxy/open-data/api/views/${datasetId}.json`,
    'dataset-metadata',
  );
}

// Pre-configured featured datasets
export const FEATURED_DATASETS = [
  {
    id: 'g4rz-x53h',
    name: 'Utah Census Cities 2009-2013',
    description: 'Population and demographic data for Utah cities.',
    category: 'Demographics',
  },
  {
    id: 'ww3j-23xv',
    name: 'Utah Census Counties 2013',
    description: 'County-level census data for Utah.',
    category: 'Demographics',
  },
  {
    id: 'kqnp-uuns',
    name: 'Utah Senate Districts 2012',
    description: 'Senate district boundaries and data (geospatial).',
    category: 'Political',
  },
  {
    id: 'xdzt-t8fg',
    name: 'South SLC Police Crime Data',
    description: 'Crime incident reports from South Salt Lake City.',
    category: 'Public Safety',
  },
];

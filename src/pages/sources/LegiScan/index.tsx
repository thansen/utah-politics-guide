import { PageContainer } from '@ant-design/pro-components';
import React from 'react';
import ApiExplorer, { type ApiSourceConfig } from '@/components/ApiExplorer';

const config: ApiSourceConfig = {
  name: 'LegiScan API',
  description:
    'Nationwide legislative tracking API. Bills, sponsors, text, amendments, roll call votes, and historical data. Consistent schema across all 50 states.',
  baseUrl: 'https://api.legiscan.com',
  docsUrl: 'https://legiscan.com/legiscan',
  authType: 'apikey',
  authDescription:
    'API key required (query parameter). Free tier: 30,000 queries/month.',
  envVar: 'LEGISCAN_API_KEY',
  endpoints: [
    {
      id: 'session-list',
      label: 'Session List',
      method: 'GET',
      path: '/?key={key}&op=getSessionList&state={state}',
      description: 'Get all legislative sessions for a state.',
      extractions: [
        {
          targetEndpoint: 'get-session-people',
          targetParam: 'id',
          responsePath: 'sessions.session_id',
          label: 'session_id from session-list',
        },
      ],
      params: [
        {
          name: 'key',
          label: 'API Key',
          type: 'string',
          required: true,
          default: '466156a185425f8880b1c62814ab884d',
        },
        {
          name: 'state',
          label: 'State',
          type: 'select',
          required: true,
          default: 'UT',
          options: [
            { label: 'Utah', value: 'UT' },
            { label: 'Idaho', value: 'ID' },
            { label: 'Nevada', value: 'NV' },
            { label: 'Arizona', value: 'AZ' },
            { label: 'Colorado', value: 'CO' },
            { label: 'Wyoming', value: 'WY' },
          ],
        },
      ],
    },
    {
      id: 'master-list',
      label: 'Master Bill List',
      method: 'GET',
      path: '/?key={key}&op=getMasterList&state={state}',
      description: 'Get all bills for a state in the current session.',
      extractions: [
        {
          targetEndpoint: 'get-bill',
          targetParam: 'id',
          responsePath: 'masterlist.bill_id',
          label: 'bill_id from master-list',
        },
      ],
      params: [
        {
          name: 'key',
          label: 'API Key',
          type: 'string',
          required: true,
          default: '466156a185425f8880b1c62814ab884d',
        },
        {
          name: 'state',
          label: 'State',
          type: 'select',
          required: true,
          default: 'UT',
          options: [
            { label: 'Utah', value: 'UT' },
            { label: 'Idaho', value: 'ID' },
            { label: 'Nevada', value: 'NV' },
          ],
        },
      ],
    },
    {
      id: 'get-bill',
      label: 'Get Bill',
      method: 'GET',
      path: '/?key={key}&op=getBill&id={id}',
      description: 'Get detailed information for a specific bill by ID.',
      extractions: [
        {
          targetEndpoint: 'get-bill-text',
          targetParam: 'id',
          responsePath: 'bill.texts.doc_id',
          label: 'doc_id from get-bill',
        },
        {
          targetEndpoint: 'get-roll-call',
          targetParam: 'id',
          responsePath: 'bill.votes.roll_call_id',
          label: 'roll_call_id from get-bill',
        },
        {
          targetEndpoint: 'get-person',
          targetParam: 'id',
          responsePath: 'bill.sponsors.people_id',
          label: 'people_id from get-bill',
        },
      ],
      params: [
        {
          name: 'key',
          label: 'API Key',
          type: 'string',
          required: true,
          default: '466156a185425f8880b1c62814ab884d',
        },
        {
          name: 'id',
          label: 'Bill ID',
          type: 'number',
          required: true,
          description: 'LegiScan bill_id (numeric)',
        },
      ],
    },
    {
      id: 'get-bill-text',
      label: 'Get Bill Text',
      method: 'GET',
      path: '/?key={key}&op=getBillText&id={id}',
      description: 'Get the full text of a bill document.',
      params: [
        {
          name: 'key',
          label: 'API Key',
          type: 'string',
          required: true,
          default: '466156a185425f8880b1c62814ab884d',
        },
        {
          name: 'id',
          label: 'Document ID',
          type: 'number',
          required: true,
          description: 'LegiScan doc_id from bill details',
        },
      ],
    },
    {
      id: 'get-roll-call',
      label: 'Get Roll Call',
      method: 'GET',
      path: '/?key={key}&op=getRollCall&id={id}',
      description: 'Get roll call voting record details.',
      params: [
        {
          name: 'key',
          label: 'API Key',
          type: 'string',
          required: true,
          default: '466156a185425f8880b1c62814ab884d',
        },
        {
          name: 'id',
          label: 'Roll Call ID',
          type: 'number',
          required: true,
          description: 'Roll call ID from bill details',
        },
      ],
    },
    {
      id: 'get-person',
      label: 'Get Person',
      method: 'GET',
      path: '/?key={key}&op=getPerson&id={id}',
      description: 'Get legislator information by person ID.',
      params: [
        {
          name: 'key',
          label: 'API Key',
          type: 'string',
          required: true,
          default: '466156a185425f8880b1c62814ab884d',
        },
        {
          name: 'id',
          label: 'Person ID',
          type: 'number',
          required: true,
          description: 'LegiScan people_id',
        },
      ],
    },
    {
      id: 'search',
      label: 'Search Bills',
      method: 'GET',
      path: '/?key={key}&op=search&state={state}&query={query}',
      description: 'Search bills by keyword within a state.',
      extractions: [
        {
          targetEndpoint: 'get-bill',
          targetParam: 'id',
          responsePath: 'searchresult.results.bill_id',
          label: 'bill_id from search',
        },
      ],
      params: [
        {
          name: 'key',
          label: 'API Key',
          type: 'string',
          required: true,
          default: '466156a185425f8880b1c62814ab884d',
        },
        {
          name: 'state',
          label: 'State',
          type: 'select',
          required: true,
          default: 'UT',
          options: [
            { label: 'Utah', value: 'UT' },
            { label: 'All States', value: 'ALL' },
          ],
        },
        {
          name: 'query',
          label: 'Search Query',
          type: 'string',
          required: true,
          default: 'education',
          description: 'Keywords to search for',
        },
      ],
    },
    {
      id: 'get-session-people',
      label: 'Session People',
      method: 'GET',
      path: '/?key={key}&op=getSessionPeople&id={id}',
      description: 'Get all legislators for a specific session.',
      extractions: [
        {
          targetEndpoint: 'get-person',
          targetParam: 'id',
          responsePath: 'sessionpeople.people.people_id',
          label: 'people_id from session-people',
        },
      ],
      params: [
        {
          name: 'key',
          label: 'API Key',
          type: 'string',
          required: true,
          default: '466156a185425f8880b1c62814ab884d',
        },
        {
          name: 'id',
          label: 'Session ID',
          type: 'number',
          required: true,
          description: 'Session ID from getSessionList',
        },
      ],
    },
  ],
  buildRequestUrl: (endpoint, params) => {
    let path = endpoint.path;
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') {
        path = path.replace(`{${key}}`, encodeURIComponent(String(value)));
      }
    }
    return `/api/proxy/legiscan${path}`;
  },
};

export default function LegiScan() {
  return (
    <PageContainer>
      <ApiExplorer config={config} />
    </PageContainer>
  );
}

import { PageContainer } from '@ant-design/pro-components';
import React from 'react';
import ApiExplorer, { type ApiSourceConfig } from '@/components/ApiExplorer';

const config: ApiSourceConfig = {
  name: 'Utah Legislature API',
  description:
    'Official JSON endpoints for Utah legislative data — bills, legislators, committees, calendars, voting records, and Utah Code.',
  baseUrl: 'https://glen.le.utah.gov',
  docsUrl: 'https://le.utah.gov/data/developer.htm',
  authType: 'token',
  authDescription: 'Developer token required (appended to URL path)',
  envVar: 'UTAH_LEG_TOKEN',
  endpoints: [
    {
      id: 'bill-list',
      label: 'Bill List',
      method: 'GET',
      path: '/bills/{session}/billlist/{token}',
      description: 'Get a list of all bills for a legislative session.',
      params: [
        {
          name: 'session',
          label: 'Session',
          type: 'select',
          required: true,
          default: '2025GS',
          options: [
            { label: '2025 General Session', value: '2025GS' },
            { label: '2024 General Session', value: '2024GS' },
            { label: '2024 Special Session 1', value: '2024S1' },
            { label: '2023 General Session', value: '2023GS' },
            { label: '2022 General Session', value: '2022GS' },
          ],
        },
        {
          name: 'token',
          label: 'Developer Token',
          type: 'string',
          required: true,
          default: 'C234F6FA06542CF7E60570F1BF743B26',
          description: 'Your developer token from le.utah.gov',
        },
      ],
    },
    {
      id: 'bill-detail',
      label: 'Bill Detail',
      method: 'GET',
      path: '/bills/{session}/{bill}/{token}',
      description:
        'Get detailed information for a specific bill including sponsors, status, and history.',
      params: [
        {
          name: 'session',
          label: 'Session',
          type: 'select',
          required: true,
          default: '2025GS',
          options: [
            { label: '2025 General Session', value: '2025GS' },
            { label: '2024 General Session', value: '2024GS' },
            { label: '2023 General Session', value: '2023GS' },
          ],
        },
        {
          name: 'bill',
          label: 'Bill ID',
          type: 'string',
          required: true,
          default: 'HB0001',
          description: 'e.g. HB0001, SB0002',
        },
        {
          name: 'token',
          label: 'Developer Token',
          type: 'string',
          required: true,
          default: 'C234F6FA06542CF7E60570F1BF743B26',
        },
      ],
    },
    {
      id: 'passed-list',
      label: 'Passed Bills',
      method: 'GET',
      path: '/bills/{session}/passedlist/{token}',
      description: 'Get a list of bills that have passed for a session.',
      params: [
        {
          name: 'session',
          label: 'Session',
          type: 'select',
          required: true,
          default: '2025GS',
          options: [
            { label: '2025 General Session', value: '2025GS' },
            { label: '2024 General Session', value: '2024GS' },
            { label: '2023 General Session', value: '2023GS' },
          ],
        },
        {
          name: 'token',
          label: 'Developer Token',
          type: 'string',
          required: true,
          default: 'C234F6FA06542CF7E60570F1BF743B26',
        },
      ],
    },
    {
      id: 'file-list',
      label: 'Bill Files',
      method: 'GET',
      path: '/bills/{session}/filelist/{token}',
      description: 'Get a list of available bill document files for a session.',
      params: [
        {
          name: 'session',
          label: 'Session',
          type: 'select',
          required: true,
          default: '2025GS',
          options: [
            { label: '2025 General Session', value: '2025GS' },
            { label: '2024 General Session', value: '2024GS' },
          ],
        },
        {
          name: 'token',
          label: 'Developer Token',
          type: 'string',
          required: true,
          default: 'C234F6FA06542CF7E60570F1BF743B26',
        },
      ],
    },
    {
      id: 'calendar',
      label: 'Reading Calendar',
      method: 'GET',
      path: '/calendar/{calendar}/{token}',
      description:
        'Get the bill list for a specific reading calendar. Check no more than once per hour.',
      params: [
        {
          name: 'calendar',
          label: 'Calendar Name',
          type: 'string',
          required: true,
          default: 'HouseThirdReading',
          description: 'e.g. HouseThirdReading, SenateThirdReading',
        },
        {
          name: 'token',
          label: 'Developer Token',
          type: 'string',
          required: true,
          default: 'C234F6FA06542CF7E60570F1BF743B26',
        },
      ],
    },
    {
      id: 'code-list',
      label: 'Utah Code Titles',
      method: 'GET',
      path: '/code/list/{token}',
      description:
        'Get a list of all Utah Code titles. Check no more than once per day.',
      params: [
        {
          name: 'token',
          label: 'Developer Token',
          type: 'string',
          required: true,
          default: 'C234F6FA06542CF7E60570F1BF743B26',
        },
      ],
    },
    {
      id: 'code-section',
      label: 'Utah Code Section',
      method: 'GET',
      path: '/code/{section}/{token}',
      description:
        'Get a specific section of Utah Code. Use format like 3, 3-1, or 3-1-1.',
      params: [
        {
          name: 'section',
          label: 'Section',
          type: 'string',
          required: true,
          default: '3',
          description: 'Code section (e.g. 3, 3-1, 3-1-1)',
        },
        {
          name: 'token',
          label: 'Developer Token',
          type: 'string',
          required: true,
          default: 'C234F6FA06542CF7E60570F1BF743B26',
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
    return `/proxy/utah-leg${path}`;
  },
};

export default function UtahLegislature() {
  return (
    <PageContainer>
      <ApiExplorer config={config} />
    </PageContainer>
  );
}

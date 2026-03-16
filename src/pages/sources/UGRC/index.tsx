import { PageContainer } from '@ant-design/pro-components';
import React from 'react';
import ApiExplorer, { type ApiSourceConfig } from '@/components/ApiExplorer';

const config: ApiSourceConfig = {
  name: 'UGRC GIS API',
  description:
    'Utah Geospatial Resource Center. Geocoding, reverse geocoding, and SGID data search — legislative districts, precincts, boundaries, census layers.',
  baseUrl: 'https://api.mapserv.utah.gov',
  docsUrl: 'https://api.mapserv.utah.gov/',
  authType: 'apikey',
  authDescription:
    'API key required (query parameter). Free — requires account at gis.utah.gov.',
  envVar: 'UGRC_API_KEY',
  endpoints: [
    {
      id: 'geocode',
      label: 'Geocode Address',
      method: 'GET',
      path: '/api/v1/geocode/{street}/{zone}',
      description:
        'Geocode a Utah street address to coordinates. Zone can be a city name or zip code.',
      extractions: [
        {
          targetEndpoint: 'reverse-geocode',
          targetParam: 'x',
          responsePath: 'result.location.x',
          label: 'x from geocode',
        },
        {
          targetEndpoint: 'reverse-geocode',
          targetParam: 'y',
          responsePath: 'result.location.y',
          label: 'y from geocode',
        },
      ],
      params: [
        {
          name: 'apikey',
          label: 'API Key',
          type: 'string',
          required: true,
          default: 'UGRC-D57F89C3785760',
        },
        {
          name: 'street',
          label: 'Street Address',
          type: 'string',
          required: true,
          default: '326 east south temple',
          description: 'Utah street address',
        },
        {
          name: 'zone',
          label: 'Zone (City or Zip)',
          type: 'string',
          required: true,
          default: 'salt lake city',
          description: 'City name or zip code',
        },
        {
          name: 'spatialReference',
          label: 'Spatial Reference',
          type: 'select',
          default: '4326',
          options: [
            { label: 'WGS 84 (lat/lng) — 4326', value: '4326' },
            { label: 'UTM Zone 12N — 26912', value: '26912' },
            { label: 'State Plane Central — 3566', value: '3566' },
          ],
          description: 'Coordinate system WKID',
        },
      ],
    },
    {
      id: 'reverse-geocode',
      label: 'Reverse Geocode',
      method: 'GET',
      path: '/api/v1/geocode/reverse/{x}/{y}',
      description: 'Reverse geocode coordinates to a street address.',
      params: [
        {
          name: 'apikey',
          label: 'API Key',
          type: 'string',
          required: true,
          default: 'UGRC-D57F89C3785760',
        },
        {
          name: 'x',
          label: 'X (Longitude)',
          type: 'string',
          required: true,
          default: '-111.8910',
          description: 'Longitude (WGS84)',
        },
        {
          name: 'y',
          label: 'Y (Latitude)',
          type: 'string',
          required: true,
          default: '40.7670',
          description: 'Latitude (WGS84)',
        },
        {
          name: 'spatialReference',
          label: 'Spatial Reference',
          type: 'select',
          default: '4326',
          options: [
            { label: 'WGS 84 (lat/lng) — 4326', value: '4326' },
            { label: 'UTM Zone 12N — 26912', value: '26912' },
          ],
        },
      ],
    },
    {
      id: 'search',
      label: 'Search SGID Data',
      method: 'GET',
      path: '/api/v1/search/{table}/{fields}',
      description:
        'Query the State Geographic Information Database (SGID). Search legislative districts, precincts, county boundaries, and more.',
      params: [
        {
          name: 'apikey',
          label: 'API Key',
          type: 'string',
          required: true,
          default: 'UGRC-D57F89C3785760',
        },
        {
          name: 'table',
          label: 'Table',
          type: 'select',
          required: true,
          default: 'boundaries.county_boundaries',
          options: [
            {
              label: 'County Boundaries',
              value: 'boundaries.county_boundaries',
            },
            {
              label: 'State House Districts',
              value: 'boundaries.state_house_districts_2022',
            },
            {
              label: 'State Senate Districts',
              value: 'boundaries.state_senate_districts_2022',
            },
            {
              label: 'US Congressional Districts',
              value: 'boundaries.us_congress_districts_2022',
            },
            {
              label: 'Municipal Boundaries',
              value: 'boundaries.municipal_boundaries',
            },
            { label: 'School Districts', value: 'boundaries.school_districts' },
            { label: 'Zip Codes', value: 'boundaries.zip_codes' },
          ],
          description: 'SGID table name',
        },
        {
          name: 'fields',
          label: 'Fields',
          type: 'string',
          required: true,
          default: 'name',
          description:
            'Comma-separated field names (e.g. name,fips). Use shape@envelope for geometry.',
        },
        {
          name: 'predicate',
          label: 'Predicate (WHERE)',
          type: 'string',
          description: "SQL WHERE clause (e.g. name LIKE 'Salt%')",
        },
        {
          name: 'geometry',
          label: 'Geometry Type',
          type: 'select',
          options: [
            { label: 'None', value: '' },
            { label: 'Point', value: 'point' },
            { label: 'Polyline', value: 'polyline' },
            { label: 'Polygon', value: 'polygon' },
          ],
          description: 'Include geometry in results',
        },
        {
          name: 'spatialReference',
          label: 'Spatial Reference',
          type: 'select',
          default: '4326',
          options: [
            { label: 'WGS 84 (lat/lng) — 4326', value: '4326' },
            { label: 'UTM Zone 12N — 26912', value: '26912' },
          ],
        },
      ],
    },
  ],
  buildRequestUrl: (endpoint, params) => {
    const {
      apikey,
      street,
      zone,
      x,
      y,
      table,
      fields,
      predicate,
      geometry,
      spatialReference,
    } = params;

    let path = endpoint.path;

    // Replace path parameters
    if (street) path = path.replace('{street}', encodeURIComponent(street));
    if (zone) path = path.replace('{zone}', encodeURIComponent(zone));
    if (x) path = path.replace('{x}', encodeURIComponent(x));
    if (y) path = path.replace('{y}', encodeURIComponent(y));
    if (table) path = path.replace('{table}', encodeURIComponent(table));
    if (fields) path = path.replace('{fields}', encodeURIComponent(fields));

    // Build query string
    const qs = new URLSearchParams();
    if (apikey) qs.append('apiKey', apikey);
    if (spatialReference) qs.append('spatialReference', spatialReference);
    if (predicate) qs.append('predicate', predicate);
    if (geometry)
      qs.append('geometry', `${geometry}:${JSON.stringify({ rings: [] })}`);

    const queryString = qs.toString();
    return `/api/proxy/ugrc${path}${queryString ? `?${queryString}` : ''}`;
  },
};

export default function UGRC() {
  return (
    <PageContainer>
      <ApiExplorer config={config} />
    </PageContainer>
  );
}

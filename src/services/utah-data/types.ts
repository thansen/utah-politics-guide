// ProTable-compatible response shape
export interface TableResponse<T> {
  data: T[];
  success: boolean;
  total: number;
}

// ── Utah Legislature ──────────────────────────────────────────────

export interface UtahBillSummary {
  bill: string;
  number: string;
  shorttitle: string;
  sponsor: string;
  floor_sponsor: string;
  status: string;
  last_action: string;
  last_action_date: string;
  [key: string]: any;
}

export interface UtahBillDetail {
  [key: string]: any;
}

export interface UtahCodeTitle {
  number: string;
  title: string;
  [key: string]: any;
}

export interface UtahCodeSection {
  [key: string]: any;
}

// ── LegiScan ──────────────────────────────────────────────────────

export interface LegiScanSession {
  session_id: number;
  state_id: number;
  year_start: number;
  year_end: number;
  special: number;
  session_name: string;
  session_title: string;
  [key: string]: any;
}

export interface LegiScanBillSummary {
  bill_id: number;
  number: string;
  title: string;
  status: number;
  status_desc?: string;
  last_action: string;
  last_action_date: string;
  url: string;
  [key: string]: any;
}

export interface LegiScanBillDetail {
  bill_id: number;
  number: string;
  title: string;
  description: string;
  state: string;
  session: { session_id: number; session_name: string };
  status: number;
  status_desc: string;
  sponsors: Array<{
    people_id: number;
    name: string;
    first_name: string;
    last_name: string;
    party: string;
    role: string;
    sponsor_type_id: number;
    sponsor_order: number;
  }>;
  votes: Array<{
    roll_call_id: number;
    date: string;
    desc: string;
    yea: number;
    nay: number;
    nv: number;
    absent: number;
    passed: number;
    chamber: string;
  }>;
  texts: Array<{
    doc_id: number;
    date: string;
    type: string;
    type_id: number;
    mime: string;
    url: string;
  }>;
  history: Array<{
    date: string;
    action: string;
    chamber: string;
    importance: number;
  }>;
  [key: string]: any;
}

export interface LegiScanLegislator {
  people_id: number;
  name: string;
  first_name: string;
  last_name: string;
  party: string;
  party_id: number;
  role: string;
  role_id: number;
  district: string;
  [key: string]: any;
}

export interface LegiScanRollCall {
  roll_call_id: number;
  bill_id: number;
  date: string;
  desc: string;
  yea: number;
  nay: number;
  nv: number;
  absent: number;
  passed: number;
  chamber: string;
  votes: Array<{
    people_id: number;
    vote_id: number;
    vote_text: string;
  }>;
  [key: string]: any;
}

export interface LegiScanPerson {
  people_id: number;
  name: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  party: string;
  party_id: number;
  role: string;
  role_id: number;
  district: string;
  state: string;
  [key: string]: any;
}

// ── Open Data ─────────────────────────────────────────────────────

export interface CatalogEntry {
  resource: {
    id: string;
    name: string;
    description: string;
    type: string;
    updatedAt: string;
    columns_name: string[];
    columns_datatype: string[];
  };
  classification: {
    domain_tags: string[];
    categories: string[];
  };
  metadata: {
    domain: string;
  };
  [key: string]: any;
}

export interface DatasetMetadata {
  id: string;
  name: string;
  description: string;
  columns: Array<{
    fieldName: string;
    name: string;
    dataTypeName: string;
    description?: string;
    position: number;
  }>;
  rowsUpdatedAt: number;
  createdAt: number;
  [key: string]: any;
}

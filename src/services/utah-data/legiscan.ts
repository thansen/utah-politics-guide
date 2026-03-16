import type {
  TableResponse,
  LegiScanSession,
  LegiScanBillSummary,
  LegiScanBillDetail,
  LegiScanLegislator,
  LegiScanPerson,
  LegiScanRollCall,
} from './types';

const KEY = '466156a185425f8880b1c62814ab884d';
const STATE = 'UT';

async function fetchJson(url: string, endpointId: string) {
  const res = await fetch(url, {
    headers: { 'X-Endpoint-Id': endpointId },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

export async function fetchSessionList(): Promise<LegiScanSession[]> {
  const json = await fetchJson(
    `/api/proxy/legiscan/?key=${KEY}&op=getSessionList&state=${STATE}`,
    'session-list',
  );
  const raw = json?.sessions ?? [];
  return Array.isArray(raw) ? raw : Object.values(raw);
}

export async function fetchMasterList(): Promise<TableResponse<LegiScanBillSummary>> {
  const json = await fetchJson(
    `/api/proxy/legiscan/?key=${KEY}&op=getMasterList&state=${STATE}`,
    'master-list',
  );
  const raw = json?.masterlist ?? {};
  const bills = Object.values(raw).filter(
    (item: any) => typeof item === 'object' && item !== null && 'bill_id' in item,
  ) as LegiScanBillSummary[];
  return { data: bills, success: true, total: bills.length };
}

export async function fetchBill(billId: number): Promise<LegiScanBillDetail> {
  const json = await fetchJson(
    `/api/proxy/legiscan/?key=${KEY}&op=getBill&id=${billId}`,
    'get-bill',
  );
  return json?.bill ?? json;
}

export async function fetchBillText(docId: number): Promise<any> {
  return fetchJson(
    `/api/proxy/legiscan/?key=${KEY}&op=getBillText&id=${docId}`,
    'get-bill-text',
  );
}

export async function fetchRollCall(rollCallId: number): Promise<LegiScanRollCall> {
  const json = await fetchJson(
    `/api/proxy/legiscan/?key=${KEY}&op=getRollCall&id=${rollCallId}`,
    'get-roll-call',
  );
  return json?.roll_call ?? json;
}

export async function fetchPerson(personId: number): Promise<LegiScanPerson> {
  const json = await fetchJson(
    `/api/proxy/legiscan/?key=${KEY}&op=getPerson&id=${personId}`,
    'get-person',
  );
  return json?.person ?? json;
}

export async function fetchSessionPeople(
  sessionId: number,
): Promise<TableResponse<LegiScanLegislator>> {
  const json = await fetchJson(
    `/api/proxy/legiscan/?key=${KEY}&op=getSessionPeople&id=${sessionId}`,
    'get-session-people',
  );
  const raw = json?.sessionpeople?.people ?? [];
  const people: LegiScanLegislator[] = Array.isArray(raw) ? raw : Object.values(raw);
  return { data: people, success: true, total: people.length };
}

export async function searchBills(
  query: string,
): Promise<TableResponse<LegiScanBillSummary>> {
  const json = await fetchJson(
    `/api/proxy/legiscan/?key=${KEY}&op=search&state=${STATE}&query=${encodeURIComponent(query)}`,
    'search',
  );
  const raw = json?.searchresult ?? {};
  const results = Object.values(raw).filter(
    (item: any) => typeof item === 'object' && item !== null && 'bill_id' in item,
  ) as LegiScanBillSummary[];
  return { data: results, success: true, total: results.length };
}

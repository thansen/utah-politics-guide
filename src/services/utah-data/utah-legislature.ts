import type { TableResponse, UtahBillSummary, UtahBillDetail, UtahCodeTitle, UtahCodeSection } from './types';

const TOKEN = 'C234F6FA06542CF7E60570F1BF743B26';

async function fetchJson(url: string, endpointId: string) {
  const res = await fetch(url, {
    headers: { 'X-Endpoint-Id': endpointId },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

export async function fetchBillList(session: string): Promise<TableResponse<UtahBillSummary>> {
  const res = await fetch(`/api/enriched/bills/${session}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  const json = await res.json();
  const raw = json?.bills ?? json;
  const items: any[] = Array.isArray(raw) ? raw : Object.values(raw);
  const bills: UtahBillSummary[] = items.map((b) => ({
    ...b,
    bill: b.bill ?? b.number ?? '',
    last_action_date: b.last_action_date ?? b.lastActionTime ?? '',
  }));
  return { data: bills, success: true, total: bills.length };
}

export async function fetchPassedBills(session: string): Promise<TableResponse<UtahBillSummary>> {
  const json = await fetchJson(
    `/api/proxy/utah-leg/bills/${session}/passedlist/${TOKEN}`,
    'passed-list',
  );
  const raw = json?.bills ?? json;
  const items: any[] = Array.isArray(raw) ? raw : Object.values(raw);
  const bills: UtahBillSummary[] = items.map((b) => ({
    ...b,
    bill: b.bill ?? b.number ?? '',
    last_action_date: b.last_action_date ?? b.lastActionTime ?? '',
  }));
  return { data: bills, success: true, total: bills.length };
}

export async function fetchBillDetail(session: string, bill: string): Promise<UtahBillDetail> {
  return fetchJson(
    `/api/proxy/utah-leg/bills/${session}/${encodeURIComponent(bill)}/${TOKEN}`,
    'bill-detail',
  );
}

export async function fetchBillFiles(session: string): Promise<any[]> {
  const json = await fetchJson(
    `/api/proxy/utah-leg/bills/${session}/filelist/${TOKEN}`,
    'file-list',
  );
  const raw = json?.files ?? json;
  return Array.isArray(raw) ? raw : Object.values(raw);
}

export async function fetchCodeTitles(): Promise<TableResponse<UtahCodeTitle>> {
  const json = await fetchJson(`/api/proxy/utah-leg/code/list/${TOKEN}`, 'code-list');
  const raw = json?.titles ?? json;
  const titles: UtahCodeTitle[] = Array.isArray(raw) ? raw : Object.values(raw);
  return { data: titles, success: true, total: titles.length };
}

export async function fetchCodeSection(section: string): Promise<UtahCodeSection> {
  return fetchJson(
    `/api/proxy/utah-leg/code/${encodeURIComponent(section)}/${TOKEN}`,
    'code-section',
  );
}

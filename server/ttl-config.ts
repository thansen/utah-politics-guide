export const TTL_SECONDS: Record<string, number> = {
  // Utah Legislature
  'utah-leg::bill-list':    4 * 3600,
  'utah-leg::bill-detail':  4 * 3600,
  'utah-leg::passed-list':  4 * 3600,
  'utah-leg::file-list':    4 * 3600,
  'utah-leg::calendar':     1 * 3600,
  'utah-leg::code-list':    24 * 3600,
  'utah-leg::code-section': 24 * 3600,

  // LegiScan
  'legiscan::session-list':       24 * 3600,
  'legiscan::master-list':        4 * 3600,
  'legiscan::get-bill':           4 * 3600,
  'legiscan::get-bill-text':      4 * 3600,
  'legiscan::get-roll-call':      4 * 3600,
  'legiscan::get-person':         24 * 3600,
  'legiscan::get-session-people': 24 * 3600,
  'legiscan::search':             1 * 3600,

  // Open Data
  'open-data::catalog-search':   24 * 3600,
  'open-data::query-dataset':    12 * 3600,
  'open-data::dataset-metadata': 24 * 3600,
  'open-data::count-dataset':    12 * 3600,

  // UGRC
  'ugrc::geocode':         30 * 24 * 3600,
  'ugrc::reverse-geocode': 30 * 24 * 3600,
  'ugrc::search':          24 * 3600,
};

export const DEFAULT_TTL = 4 * 3600;

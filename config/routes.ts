export default [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'dashboard',
    component: './Dashboard',
  },
  {
    path: '/data',
    name: 'Data',
    icon: 'database',
    routes: [
      {
        path: '/data/bills',
        name: 'UT Legislature Bills',
        component: './data/UtahLegBills',
      },
      {
        path: '/data/bills/:session/:bill',
        component: './data/UtahLegBills/BillDetail',
        hideInMenu: true,
      },
      {
        path: '/data/utah-code',
        name: 'Utah Code',
        component: './data/UtahLegCode',
      },
      {
        path: '/data/legiscan-bills',
        name: 'LegiScan Bills',
        component: './data/LegiScanBills',
      },
      {
        path: '/data/legiscan-bills/:billId',
        component: './data/LegiScanBills/BillDetail',
        hideInMenu: true,
      },
      {
        path: '/data/legislators',
        name: 'Legislators',
        component: './data/LegiScanLegislators',
      },
      {
        path: '/data/legislators/:personId',
        component: './data/LegiScanLegislators/LegislatorDetail',
        hideInMenu: true,
      },
      {
        path: '/data/open-data',
        name: 'Open Data',
        component: './data/OpenDataBrowser',
      },
      {
        path: '/data/open-data/:datasetId',
        component: './data/OpenDataBrowser/DatasetViewer',
        hideInMenu: true,
      },
    ],
  },
  {
    path: '/sources',
    name: 'API Sources',
    icon: 'api',
    routes: [
      {
        path: '/sources/utah-legislature',
        name: 'Utah Legislature',
        component: './sources/UtahLegislature',
      },
      {
        path: '/sources/legiscan',
        name: 'LegiScan',
        component: './sources/LegiScan',
      },
      {
        path: '/sources/open-data',
        name: 'Utah Open Data',
        component: './sources/OpenData',
      },
      {
        path: '/sources/ugrc',
        name: 'UGRC GIS',
        component: './sources/UGRC',
      },
    ],
  },
  {
    component: '404',
    layout: false,
    path: './*',
  },
];

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

/* eslint-disable */
const CompetitorComparisonHome = () => import('./components/CompetitorComparisonHome.vue');
const DashboardHome = () => import('./components/DashboardHome.vue');
const InquiriesHome = () => import('./components/InquiriesHome.vue');
const LoginHome = () => import('./components/LoginHome.vue');
const ProblemReportsHome = () => import('./components/ProblemReportsHome.vue');
const SettingsHome = () => import('./components/SettingsHome.vue');

export const ROUTE_EMPTY = "";
export const ROUTE_DEFAULT = "/";
export const ROUTE_ALL = "*";
export const ROUTE_DASHBOARD = "/dashboard";
export const ROUTE_LOGIN = "/login";
export const ROUTE_PROBLEM_REPORTS = "/problemReports";
export const ROUTE_INQUIRIES = "/inquiries";
export const ROUTE_COMPARISON = "/comparison";
export const ROUTE_SETTINGS = "/settings";

export const routes = [{
    path: ROUTE_EMPTY,
    redirect: ROUTE_DASHBOARD
  },
  {
    path: ROUTE_DASHBOARD,
    component: DashboardHome
  },
  {
    path: ROUTE_LOGIN,
    component: LoginHome
  },
  {
    path: ROUTE_PROBLEM_REPORTS,
    component: ProblemReportsHome
  },
  {
    path: ROUTE_INQUIRIES,
    component: InquiriesHome
  },
  {
    path: ROUTE_COMPARISON,
    component: CompetitorComparisonHome
  },
  {
    path: ROUTE_SETTINGS,
    component: SettingsHome
  },
  {
    path: ROUTE_ALL,
    redirect: ROUTE_DASHBOARD
  }
];
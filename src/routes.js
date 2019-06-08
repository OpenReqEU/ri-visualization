/* eslint-disable */
import CompetitorComparisonHome from './components/CompetitorComparisonHome.vue';
import DashboardHome from './components/DashboardHome.vue';
import LoginHome from './components/LoginHome.vue';
import SettingsHome from './components/SettingsHome.vue';
import TweetCategoryHome from './components/TweetCategoryHome.vue';

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
    component: TweetCategoryHome
  },
  {
    path: ROUTE_INQUIRIES,
    component: TweetCategoryHome
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
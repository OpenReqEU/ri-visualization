import DashboardHome from './components/DashboardHome.vue';
import SettingsHome from './components/SettingsHome.vue';
import TweetCategoryHome from './components/TweetCategoryHome.vue';
export const routes = [{
  path: '',
  redirect: '/dashboard'
},
{
  path: '/dashboard',
  component: DashboardHome
},
{
  path: '/problemReports',
  component: TweetCategoryHome
},
{
  path: '/inquiries',
  component: TweetCategoryHome
},
{
  path: '/settings',
  component: SettingsHome
}
];
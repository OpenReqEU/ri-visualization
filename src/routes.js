import DashboardHome from './components/DashboardHome.vue';
import TweetCategoryHome from './components/TweetCategoryHome.vue';
export const routes = [{
  path: '',
  redirect: '/ri-visualization/dashboard'
},
{
  path: '/ri-visualization/',
  redirect: '/ri-visualization/dashboard'
},
{
  path: '/ri-visualization/dashboard',
  component: DashboardHome
},
{
  path: '/ri-visualization/problemReports',
  component: TweetCategoryHome
},
{
  path: '/ri-visualization/inquiries',
  component: TweetCategoryHome
}
];
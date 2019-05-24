import Vue from 'vue';
import VueRouter from 'vue-router';
import VueTour from 'vue-tour';
import 'vue-tour/dist/vue-tour.css';
import App from './App.vue';
import './plugins/vuetify';
import {
  routes
} from './routes';
import {
  store
} from './store/store';

Vue.config.productionTip = true;
Vue.use(VueTour);
Vue.use(VueRouter);
const router = new VueRouter({
  base: '/',
  mode: 'history',
  routes
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  if (to.path !== '/login' && !store.getters.loggedIn) {
    return next('/login');
  }

  next();
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
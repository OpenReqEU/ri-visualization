import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import './plugins/vuetify';
import {
  routes
} from './routes';
import {
  store
} from './store/store';

Vue.config.productionTip = true;
Vue.use(VueRouter);
const router = new VueRouter({
  base: '/',
  mode: 'history',
  routes
});

router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && !store.getters.accessKey) {
    return next('/login');
  }

  next();
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
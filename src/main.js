import Vue from 'vue';
import './plugins/vuetify'
import VueRouter from 'vue-router';
import VueTour from 'vue-tour';
import 'vue-tour/dist/vue-tour.css';
import App from './App.vue';
import './plugins/vuetify';
import { routes } from './routes';
import { store } from './store/store';

Vue.config.productionTip = true;
Vue.use(VueTour);
Vue.use(VueRouter);
const router = new VueRouter({
  mode: 'history',
  routes
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as getters from './getters';
import sentiment from './modules/sentiment';
import * as mutations from './mutations';
Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    topBarTitle: 'Dashboard',
    twitterAccounts: [],
    tweets: {},
    initialDataLoaded: false,
    filteredTweets: [],
    dataUpToDate: false,
    dataUpdating: false,
    showTutorial: false,
    loggedIn: false,
    user: ""
  },
  getters,
  mutations,
  actions,
  modules: {
    sentiment
  }
});
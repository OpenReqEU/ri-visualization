import axios from 'axios';
import moment from "moment";
import "moment/locale/de";
import {
  GET_ALL_TWEETS_ENDPOINT
} from './../RESTconf';
import {
  ACTION_RESET_FILTERED_TWEETS,
  MUTATE_FILTERED_TWEETS,
  MUTATE_TOOLBAR_HEADER
} from './../store/types';

export const actionFetchInitialData = ({
  state,
  commit
}, twitterAccounts) => {
  return new Promise((resolve, reject) => {
    twitterAccounts.forEach(twitterAccount => {
      axios
        .get(GET_ALL_TWEETS_ENDPOINT(twitterAccount))
        .then(response => {
          let payload = {};
          payload[twitterAccount] = response.data;
          state.tweets = Object.assign({}, state.tweets, payload);
          let hasAllKeys = twitterAccounts.every(function (item) {
            return Object.prototype.hasOwnProperty.call(state.tweets, item);
          });
          if (hasAllKeys) {
            state.initialDataLoaded = hasAllKeys;
            resolve();
          }
        })
        .catch(e => {
          this.errors.push(e);
          reject(e);
        });
    });
  });
};
export const actionFilterTweets = ({
  state,
  dispatch,
  commit
}, payload) => {
  // 1. reset filtered tweets to all tweets
  // 2. check if the user filters for a specific account => if yes, filter
  // 3. check if the user filters for a time-frame => if yes, filter
  // 4. update state via commit
  state.dataUpToDate = false;
  state.dataUpdating = true;

  // 1. reset filtered tweets to all tweets
  dispatch(ACTION_RESET_FILTERED_TWEETS);

  let tmpFilteredTweets = [];

  // 2. check if the user filters for a specific account => if yes, filter
  if (payload.twitterAccount === 'All') {
    Object.keys(state.tweets).forEach(function (account) {
      tmpFilteredTweets = tmpFilteredTweets.concat(state.tweets[account]);
    });
  } else {
    tmpFilteredTweets = state.tweets[payload.twitterAccount];
  }

  // 3. check if the user filters for a time-frame => if yes, filter
  if (payload.fromDate !== null) {
    let dateFromCompare = moment(payload.fromDate, 'YYYY-MM-DD').format('YYYYMMDD');
    tmpFilteredTweets = tmpFilteredTweets.filter(tweet => tweet.created_at >= dateFromCompare);
  }
  if (payload.toDate !== null) {
    let dateToCompare = moment(payload.toDate, 'YYYY-MM-DD').format('YYYYMMDD');
    tmpFilteredTweets = tmpFilteredTweets.filter(tweet => tweet.created_at <= dateToCompare);
  }

  // 4. update state via commit
  state.dataUpdating = false;
  commit(MUTATE_FILTERED_TWEETS, tmpFilteredTweets);
  state.dataUpToDate = true;
};
export const actionResetFilteredTweets = ({
  state,
  commit
}) => {
  let tmpFilteredTweets = [];
  Object.keys(state.tweets).forEach(function (account) {
    tmpFilteredTweets = tmpFilteredTweets.concat(state.tweets[account]);
  });
  commit(MUTATE_FILTERED_TWEETS, tmpFilteredTweets);
};
export const actionUpdateTweet = ({
  state
}, tweet) => {
  // update the original data source (tweets)
  Object.keys(state.tweets).forEach(function (account) {
    for (let i = 0; i < state.tweets[account].length; i++) {
      if (state.tweets[account][i].status_id === tweet.status_id) {
        state.tweets[account][i] = tweet;
      }
    }
  });

  // update filtered tweet lis
  for (let i = 0; i < state.filteredTweets.length; i++) {
    if (state.filteredTweets[i].status_id === tweet.status_id) {
      state.filteredTweets[i] = tweet;
    }
  }

  // notify listener
  state.dataUpToDate = true;
};
export const actionRemoveUnlabeledTweet = ({
  state
}, statusID) => {
  for (let i = 0; i < state.unlabeledTweets.length; i++) {
    if (state.unlabeledTweets[i].status_id === statusID) {
      state.unlabeledTweets.splice(i, 1);
    }
  }
};
export const setToolbarHeader = ({
  commit
}, title) => {
  commit(MUTATE_TOOLBAR_HEADER, title);
};
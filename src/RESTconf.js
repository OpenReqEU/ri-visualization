/* eslint-disable */
export const BASE_URL = process.env.VUE_APP_BASE_URL;
export const BACKUP_URL = process.env.VUE_APP_BACKUP_URL;

export const GET_ALL_TWEETS_ENDPOINT = function (twitterAccount) {
  return `${BASE_URL}/account_name/${twitterAccount}/all`;
};
export const GET_TWITTER_ACCOUNT_EXISTS_ENDPOINT = function (twitterAccount) {
  return `https://api.openreq.eu/ri-collection-explicit-feedback-twitter/${twitterAccount}/exists`;
};
export const GET_TWITTER_OBSERVABLES_ENDPOINT = function (twitterAccount) {
  return `${BASE_URL}/observables`;
};
export const POST_TWEET_LABEL_ENDPOINT = function () {
  return `${BASE_URL}/label/tweet/`;
};
export const POST_TWEET_LABEL_PAYLOAD = function (data) {
  let payload = {
    status_id: data.status_id,
    label: data.label,
    date: data.date,
    previous_label: data.previous_label
  };
  return JSON.stringify(payload);
};
export const POST_TWEET_LABEL_BACKUP_ENDPOINT = function () {
  if (BACKUP_URL) {
    return `${BACKUP_URL}/windtretrial/labeledtweet`;
  } else {
    return null;
  }
};
export const POST_TWEET_LABEL_BACKUP_PAYLOAD = function (data) {
  let payload = {
    status_id: data.status_id,
    label: data.label,
    text: data.text,
    date: data.date,
    previous_label: data.previous_label
  };
  return JSON.stringify(payload);
};
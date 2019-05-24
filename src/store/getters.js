export const getTopBarTitle = state => {
  return state.topBarTitle;
};
export const tweets = state => {
  return state.tweets;
};
export const loggedIn = state => {
  return state.loggedIn;
};
export const userConfigurationTwitterAccounts = state => {
  console.log("userConfigurationTwitterAccounts", state.userConfiguration);
  console.log("userConfigurationTwitterAccounts", state.userConfiguration.twitter_accounts);

  return state.userConfiguration.twitter_accounts;
};
export const filteredTweets = state => {
  return state.filteredTweets;
};
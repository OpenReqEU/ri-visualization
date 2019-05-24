export const mutateInitalData = (state, initialData) => {
  state.tweets = Object.assign({}, state.tweets, initialData);
  let hasAllKeys = state.twitterAccounts.every(function (item) {
    return Object.prototype.hasOwnProperty.call(state.tweets, item);
  });
  state.initialDataLoaded = hasAllKeys;
};

export const mutateTweets = (state, tweets) => {
  state.tweets = tweets;
};

export const mutateLoggedIn = (state, loggedIn) => {
  state.loggedIn = loggedIn;
};

export const mutateUserConfiguration = (state, userConfiguration) => {
  state.userConfiguration = userConfiguration;
};

export const mutateToobarHeader = (state, title) => {
  state.topBarTitle = title;
};

export const mutateFilteredTweets = (state, filteredTweets) => {
  state.dataUpToDate = true;
  state.filteredTweets = filteredTweets;
};
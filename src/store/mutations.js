export const mutateInitalData = (state, initialData) => {
  state.tweets = Object.assign({}, state.tweets, initialData);
  let hasAllKeys = state.twitterAcconts.every(function (item) {
    return Object.prototype.hasOwnProperty.call(state.tweets, item);
  });
  state.initialDataLoaded = hasAllKeys;
};

export const mutateToobarHeader = (state, title) => {
  state.topBarTitle = title;
};

export const mutateFilteredTweets = (state, filteredTweets) => {
  state.dataUpToDate = true;
  state.filteredTweets = filteredTweets;
};
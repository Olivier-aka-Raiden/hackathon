/**
 * Challenge Reducer
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */

// Set initial state
export const initialState = {
  challengeTypes: [],
  challengeList: [],
  favourites: [],
};

export default function challengeReducer(state = initialState, action) {
  switch (action.type) {
    case 'FAVOURITES_REPLACE': {
      return {
        ...state,
        favourites: action.data || [],
      };
    }
    case 'CHALLENGE_TYPES_REPLACE': {
      return {
        ...state,
        challengeTypes: action.data,
      };
    }
    case 'CHALLENGE_LIST_REPLACE': {
      let challengeList = [];

      // Pick out the props I need
      if (action.data && typeof action.data === 'object') {
        challengeList = action.data.map(item => ({
          id: item.id,
          title: item.title,
          body: item.body,
          category: item.category,
          image: item.image,
          author: item.author,
          suggestions: item.suggestions,
        }));
      }

      return {
        ...state,
        challengeList,
      };
    }
    default:
      return state;
  }
}

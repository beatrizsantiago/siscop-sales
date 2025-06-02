import { State, ActionType } from './types';

const reducer = (state: State, action: ActionType):State => {
  switch (action.type) {
    case 'SET_SALES':
      return {
        ...state,
        list: [...state.list, ...action.list],
        lastDoc: action.lastDoc || undefined,
        hasMore: action.hasMore,
        loading: false,
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.loading,
      };

    default:
      throw new Error('Unhandled action');
  }
};

export default reducer;

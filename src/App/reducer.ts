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

    case 'ADD_SALE':
      return {
        ...state,
        list: [action.item, ...state.list],
      };

    case 'CANCEL_SALE': {
      return {
        ...state,
        list: state.list.map((item) => 
          item.id === action.id ? { ...item, status: 'CANCELLED' } : item,
        ),
      };
    };

    case 'SET_PRODUCT_PROFIT':
      return {
        ...state,
        productProfit: action.data,
      };

    case 'SET_FARMS_PROFIT':
      return {
        ...state,
        farmsProfit: action.data,
      };

    default:
      throw new Error('Unhandled action');
  }
};

export default reducer;

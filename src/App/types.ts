import { DocumentSnapshot } from 'firebase/firestore';
import Sale from '@domain/entities/Sale';

export type State = {
  list: Sale[],
  lastDoc?: DocumentSnapshot;
  hasMore: boolean;
  loading: boolean,
};

export type ActionType = { type: 'SET_SALES', list: Sale[], lastDoc?: DocumentSnapshot | null, hasMore: boolean }
| { type: 'SET_LOADING', loading: boolean }
| { type: 'ADD_SALE', item: Sale }
| { type: 'CANCEL_SALE', id: string };

export type SaleProviderType = {
  state: State,
  dispatch: React.Dispatch<ActionType>,
  getMoreSale: () => Promise<void>,
};

export type SaleProviderProps = {
  children: React.ReactNode,
};

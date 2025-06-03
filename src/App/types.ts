import { DocumentSnapshot } from 'firebase/firestore';
import { ProductProfit } from '@generalTypes/products';
import { FarmProfit } from '@generalTypes/farms';
import Sale from '@domain/entities/Sale';

export type State = {
  list: Sale[],
  lastDoc?: DocumentSnapshot,
  hasMore: boolean,
  loading: boolean,
  productProfit: ProductProfit[],
  farmsProfit: FarmProfit[],
};

export type ActionType = { type: 'SET_SALES', list: Sale[], lastDoc?: DocumentSnapshot | null, hasMore: boolean }
| { type: 'SET_LOADING', loading: boolean }
| { type: 'ADD_SALE', item: Sale }
| { type: 'CANCEL_SALE', id: string }
| { type: 'SET_PRODUCT_PROFIT', data: ProductProfit[] }
| { type: 'SET_FARMS_PROFIT', data: FarmProfit[] }

export type SaleProviderType = {
  state: State,
  dispatch: React.Dispatch<ActionType>,
  getMoreSale: () => Promise<void>,
  getProductProfit: () => Promise<void>,
  getFarmsProfit: () => Promise<void>,
};

export type SaleProviderProps = {
  children: React.ReactNode,
};

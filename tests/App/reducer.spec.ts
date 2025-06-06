import reducer from '../../src/App/reducer';
import { State } from '../../src/App/types';
import Sale from '../../src/domain/entities/Sale';

const initialState: State = {
  list: [],
  loading: false,
  lastDoc: undefined,
  hasMore: true,
  productProfit: [],
  farmsProfit: [],
};

describe('sales reducer', () => {
  it('should handle SET_SALES', () => {
    const action = {
      type: 'SET_SALES',
      list: [{ id: 'sale1' }] as Sale[],
      lastDoc: { id: 'mockDoc' },
      hasMore: true,
    };

    const newState = reducer(initialState, action);

    expect(newState.list).toEqual([{ id: 'sale1' }]);
    expect(newState.lastDoc).toEqual(action.lastDoc);
    expect(newState.hasMore).toBe(true);
    expect(newState.loading).toBe(false);
  });

  it('should handle SET_LOADING', () => {
    const newState = reducer(initialState, {
      type: 'SET_LOADING',
      loading: true,
    });

    expect(newState.loading).toBe(true);
  });

  it('should handle ADD_SALE', () => {
    const newSale = { id: 'new-sale' } as Sale;
    const newState = reducer(initialState, {
      type: 'ADD_SALE',
      item: newSale,
    });

    expect(newState.list[0]).toBe(newSale);
  });

  it('should handle CANCEL_SALE', () => {
    const prevState: State = {
      ...initialState,
      list: [{ id: '123', status: 'DONE' } as any],
    };

    const newState = reducer(prevState, {
      type: 'CANCEL_SALE',
      id: '123',
    });

    expect(newState.list[0].status).toBe('CANCELLED');
  });

  it('should handle SET_PRODUCT_PROFIT', () => {
    const newState = reducer(initialState, {
      type: 'SET_PRODUCT_PROFIT',
      data: [{ productId: '1', productName: 'Tomate', profit: 50 }],
    });

    expect(newState.productProfit).toHaveLength(1);
    expect(newState.productProfit[0].productId).toBe('1');
  });

  it('should handle SET_FARMS_PROFIT', () => {
    const newState = reducer(initialState, {
      type: 'SET_FARMS_PROFIT',
      data: [{ farmId: '1', farmName: 'Sítio A', profit: 120 }],
    });

    expect(newState.farmsProfit).toHaveLength(1);
    expect(newState.farmsProfit[0].farmId).toBe('1');
  });

  it('should throw error for unknown action', () => {
    expect(() => reducer(initialState, { type: 'UNKNOWN' } as any)).toThrow('Unhandled action');
  });
});

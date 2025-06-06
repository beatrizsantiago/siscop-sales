import { render, act } from '@testing-library/react';
import { useSaleContext, SaleProvider } from '../../src/App/context';
import GetSaleUseCase from '../../src/usecases/sale/getAllPaginated';
import GetProductProfitUseCase from '../../src/usecases/sale/getProductProfit';
import GetFarmsProfitUseCase from '../../src/usecases/sale/getFarmsProfit';
import Sale from '../../src/domain/entities/Sale';
import Farm from '../../src/domain/entities/Farm';
import Product from '../../src/domain/entities/Product';

jest.mock('../../src/usecases/sale/getAllPaginated');
jest.mock('../../src/usecases/sale/getProductProfit');
jest.mock('../../src/usecases/sale/getFarmsProfit');

describe('SaleProvider', () => {
  const mockSale = new Sale(
    'sale1',
    new Farm('farm1', 'Farm 1', { _lat: 0, _long: 0 }, []),
    'DONE',
    100,
    [
      {
        amount: 2,
        product: new Product('prod1', 'Tomato', 5.5, 30),
        unit_value: 5.5,
        total_value: 11
      }
    ],
    new Date()
  );

  const mockResponse = {
    list: [mockSale],
    lastDoc: { id: 'doc1' } as any,
    hasMore: true,
  };

  const mockProductProfit = [{ productId: 'prod1', productName: 'Tomato', profit: 100 }];
  const mockFarmsProfit = [{ farmId: 'farm1', farmName: 'Farm 1', profit: 100 }];

  beforeEach(() => {
    (GetSaleUseCase as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue(mockResponse),
    }));
    (GetProductProfitUseCase as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue(mockProductProfit),
    }));
    (GetFarmsProfitUseCase as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue(mockFarmsProfit),
    }));
  });

  it('should fetch and store initial sale data on mount', async () => {
    let contextValue: any = null;

    const TestComponent = () => {
      contextValue = useSaleContext();
      return null;
    };

    await act(async () => {
      render(
        <SaleProvider>
          <TestComponent />
        </SaleProvider>
      );
    });

    expect(contextValue.state.list).toHaveLength(1);
    expect(contextValue.state.list[0].id).toBe('sale1');
    expect(contextValue.state.hasMore).toBe(true);
    expect(contextValue.state.lastDoc).toEqual({ id: 'doc1' });
    expect(contextValue.state.loading).toBe(false);
    expect(contextValue.state.productProfit).toEqual(mockProductProfit);
    expect(contextValue.state.farmsProfit).toEqual(mockFarmsProfit);
  });

  it('should load more sales when getMoreSale is called', async () => {
    let contextValue: any = null;

    const TestComponent = () => {
      contextValue = useSaleContext();
      return null;
    };

    await act(async () => {
      render(
        <SaleProvider>
          <TestComponent />
        </SaleProvider>
      );
    });

    await act(async () => {
      await contextValue.getMoreSale();
    });

    expect(contextValue.state.list.length).toBe(2);
  });

  it('should not load more if hasMore is false or loading is true', async () => {
    let contextValue: any = null;

    const TestComponent = () => {
      contextValue = useSaleContext();
      return null;
    };

    await act(async () => {
      render(
        <SaleProvider>
          <TestComponent />
        </SaleProvider>
      );
    });

    act(() => {
      contextValue.state.hasMore = false;
    });

    await act(async () => {
      await contextValue.getMoreSale();
    });

    expect(contextValue.state.list.length).toBe(1);
  });
});

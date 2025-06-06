import { firebaseSale } from '../../src/firebase/sale';
import { getDoc, getDocs, addDoc } from 'firebase/firestore';
import Sale from '../../src/domain/entities/Sale';
import Product from '../../src/domain/entities/Product';
import Farm from '../../src/domain/entities/Farm';

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  startAfter: jest.fn(),
  Timestamp: {
    fromDate: jest.fn().mockImplementation(() => 'timestamp')
  },
  updateDoc: jest.fn()
}));

describe('FirebaseSale', () => {
  const mockFarm = new Farm('farm1', 'Farm 1', { _lat: 0, _long: 0 }, []);
  const mockProduct = new Product('prod1', 'Product 1', 10, 30);
  const mockSale = new Sale(
    '',
    mockFarm,
    'DONE',
    100,
    [{
      amount: 10,
      product: mockProduct,
      unit_value: 10,
      total_value: 100
    }],
    new Date('2024-01-01')
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add a new sale', async () => {
    const mockDocRef = { id: 'sale123' };
    (addDoc as jest.Mock).mockResolvedValue(mockDocRef);

    const result = await firebaseSale.add(mockSale);

    expect(addDoc).toHaveBeenCalled();
    expect(result.id).toBe('sale123');
  });

  it('should get all sales paginated', async () => {
    const mockFarmSnap = {
      exists: () => true,
      data: () => ({
        name: 'Farm 1',
        geolocation: { _lat: 0, _long: 0 },
        available_products: []
      })
    };

    const mockProductSnap = {
      exists: () => true,
      data: () => ({
        name: 'Product 1',
        unit_value: 10,
        cycle_days: 30
      })
    };

    const mockDocSnap = {
      id: 'sale1',
      data: () => ({
        farm_id: 'farm1',
        status: 'DONE',
        total_value: 100,
        created_at: {
          toDate: () => new Date('2024-01-01')
        },
        items: [{
          amount: 10,
          product_id: 'prod1',
          unit_value: 10,
          total_value: 100
        }]
      })
    };

    (getDocs as jest.Mock).mockResolvedValue({ docs: [mockDocSnap] });
    (getDoc as jest.Mock)
      .mockResolvedValueOnce(mockFarmSnap)
      .mockResolvedValueOnce(mockProductSnap);

    const result = await firebaseSale.getAllPaginated();

    expect(result.list.length).toBe(1);
    expect(result.list[0]).toBeInstanceOf(Sale);
  });

  it('should fetch all sales with farm and product data', async () => {
    const mockFarm = {
      name: 'Fazenda Exemplo',
      geolocation: { _lat: 1, _long: 2 }
    };

    const mockProduct = {
      name: 'Produto Exemplo',
      unit_value: 100,
      cycle_days: 10,
    };

    const fakeDoc = {
      id: 'venda1',
      data: () => ({
        farm_id: 'farms/farm1',
        status: 'DONE',
        total_value: 300,
        created_at: { toDate: () => new Date('2023-01-01T12:00:00Z') },
        items: [
          {
            product_id: 'products/prod1',
            amount: 3,
            unit_value: 100,
            total_value: 300,
          }
        ]
      })
    };

    (getDocs as jest.Mock).mockResolvedValue({
      docs: [fakeDoc]
    });

    (getDoc as jest.Mock).mockImplementation((ref) => {
      if (ref === 'farms/farm1') {
        return Promise.resolve({ data: () => mockFarm });
      }
      if (ref === 'products/prod1') {
        return Promise.resolve({ data: () => mockProduct });
      }
      return Promise.resolve({ data: () => null });
    });

    const resultado = await firebaseSale.findAll();

    expect(resultado.length).toBe(1);
    expect(resultado[0].id).toBe('venda1');
    expect(resultado[0].farm.name).toBe('Fazenda Exemplo');
    expect(resultado[0].items.length).toBe(1);
    expect(resultado[0].items[0].product.name).toBe('Produto Exemplo');
    expect(resultado[0].total_value).toBe(300);
    expect(resultado[0].status).toBe('DONE');
  });
});

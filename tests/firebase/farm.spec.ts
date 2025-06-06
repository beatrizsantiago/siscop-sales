import { getDocs, getDoc } from 'firebase/firestore';
import { firebaseFarm } from '../../src/firebase/farm';
import Product from '../../src/domain/entities/Product';
import Farm from '../../src/domain/entities/Farm';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn((_, id) => ({ id })),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
}));

describe('FirebaseFarm.getAll', () => {
  it('should return farms with products that have READY kardex', async () => {
    const mockFarmData = {
      name: 'Fazenda Teste',
      geolocation: { _lat: 10, _long: 20 },
      available_products: [{ id: 'prod1' }, { id: 'prod2' }],
    };

    const mockProductData = {
      prod1: { name: 'Milho', unit_value: 12, cycle_days: 30 },
      prod2: { name: 'Soja', unit_value: 8, cycle_days: 45 },
    };

    const getDocsMock = getDocs as jest.Mock;
    const getDocMock = getDoc as jest.Mock;

    getDocsMock
      .mockResolvedValueOnce({
        docs: [
          {
            id: 'farm1',
            data: () => mockFarmData,
          },
        ],
      })
      .mockResolvedValueOnce({ empty: false })
      .mockResolvedValueOnce({ empty: true });

    getDocMock
      .mockImplementation(({ id }) => ({
        exists: () => true,
        id,
        data: () => mockProductData[id],
      }));

    const farms = await firebaseFarm.getAll();

    expect(farms).toHaveLength(1);
    const farm = farms[0];

    expect(farm).toBeInstanceOf(Farm);
    expect(farm.name).toBe('Fazenda Teste');
    expect(farm.available_products).toHaveLength(1);

    const product = farm.available_products[0];
    expect(product).toBeInstanceOf(Product);
    expect(product.name).toBe('Milho');
  });
});

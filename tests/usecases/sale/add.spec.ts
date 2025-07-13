import AddSaleUseCase from '../../../src/usecases/sale/add';
import Farm from '../../../src/domain/entities/Farm';
import Product from '../../../src/domain/entities/Product';
import Sale from '../../../src/domain/entities/Sale';

describe('AddSaleUseCase', () => {
  const mockFarm = new Farm('farm1', 'Fazenda Test', { _lat: 0, _long: 0 }, []);
  const mockProduct = new Product('prod1', 'Milho', 10, 7);
  
  const mockKardexRepository = {
    getAvailableAmount: jest.fn(),
    consumeStock: jest.fn(),
  };

  const mockSaleRepository = {
    add: jest.fn(),
  };

  const mockGoalRepository = {
    findPendingSalesGoals: jest.fn().mockResolvedValue([]),
    markAsFinished: jest.fn(),
  };

  const mockNotificationRepository = {
    create: jest.fn(),
  };

  const makeSut = () => {
    return new AddSaleUseCase(mockSaleRepository, mockKardexRepository, mockGoalRepository, mockNotificationRepository);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a sale when there is enough stock', async () => {
    const sut = makeSut();

    mockKardexRepository.getAvailableAmount.mockResolvedValue(10);
    const fakeSale = new Sale('sale1', mockFarm, 'DONE', 20, [], new Date());
    mockSaleRepository.add.mockResolvedValue(fakeSale);

    const result = await sut.execute({
      farm: mockFarm,
      items: [
        {
          amount: 2,
          product: mockProduct,
          unit_value: 10,
        }
      ]
    });

    expect(mockKardexRepository.getAvailableAmount).toHaveBeenCalledWith('farm1', 'prod1');
    expect(mockSaleRepository.add).toHaveBeenCalled();
    expect(mockKardexRepository.consumeStock).toHaveBeenCalledWith('farm1', 'prod1', 2);
    expect(result).toBe(fakeSale);
  });

  it('should throw an error if stock is insufficient', async () => {
    const sut = makeSut();

    mockKardexRepository.getAvailableAmount.mockResolvedValue(1);

    await expect(
      sut.execute({
        farm: mockFarm,
        items: [
          {
            amount: 2,
            product: mockProduct,
            unit_value: 10,
          }
        ]
      })
    ).rejects.toThrow('INSUFFICIENT_STOCK:Milho');
  });
});

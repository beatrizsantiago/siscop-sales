import CancelSaleUseCase from '../../../src/usecases/sale/cancel';

describe('CancelSaleUseCase', () => {
  const mockSale = {
    items: [
      {
        product_id: { id: 'prod1' },
        amount: 3,
      },
      {
        product_id: { id: 'prod2' },
        amount: 5,
      }
    ],
    farm_id: { id: 'farm1' },
  };

  const mockSaleRepository = {
    findById: jest.fn(),
    updateStatus: jest.fn(),
  };

  const mockKardexRepository = {
    restoreStock: jest.fn(),
  };

  const makeSut = () => {
    return new CancelSaleUseCase(mockSaleRepository, mockKardexRepository);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSaleRepository.findById.mockResolvedValue(mockSale);
  });

  it('should cancel sale and restore stock for each item', async () => {
    const sut = makeSut();

    await sut.execute('sale123');

    expect(mockSaleRepository.findById).toHaveBeenCalledWith('sale123');
    expect(mockSaleRepository.updateStatus).toHaveBeenCalledWith('sale123', 'CANCELLED');

    expect(mockKardexRepository.restoreStock).toHaveBeenCalledTimes(2);
    expect(mockKardexRepository.restoreStock).toHaveBeenCalledWith('farm1', 'prod1', 3);
    expect(mockKardexRepository.restoreStock).toHaveBeenCalledWith('farm1', 'prod2', 5);
  });
});

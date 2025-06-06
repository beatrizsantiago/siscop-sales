import GetProductProfitUseCase from '../../../src/usecases/sale/getProductProfit';

describe('GetProductProfitUseCase', () => {
  const mockRepository = {
    findAll: jest.fn(),
  };

  const makeSut = () => new GetProductProfitUseCase(mockRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return top 10 products by profit with DONE sales only', async () => {
    const fakeSales = [
      {
        status: 'DONE',
        items: [
          { product: { id: '1', name: 'Produto A' }, total_value: 100 },
          { product: { id: '2', name: 'Produto B' }, total_value: 200 },
        ],
      },
      {
        status: 'CANCELLED',
        items: [
          { product: { id: '1', name: 'Produto A' }, total_value: 999 },
        ],
      },
      {
        status: 'DONE',
        items: [
          { product: { id: '1', name: 'Produto A' }, total_value: 300 },
        ],
      },
    ];

    mockRepository.findAll.mockResolvedValue(fakeSales);

    const sut = makeSut();
    const result = await sut.execute();

    expect(result).toEqual([
      {
        productId: '1',
        productName: 'Produto A',
        profit: 400,
      },
      {
        productId: '2',
        productName: 'Produto B',
        profit: 200,
      },
    ]);

    expect(result.length).toBeLessThanOrEqual(10);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });

  it('should return empty array if there are no sales', async () => {
    mockRepository.findAll.mockResolvedValue([]);

    const sut = makeSut();
    const result = await sut.execute();

    expect(result).toEqual([]);
  });
});

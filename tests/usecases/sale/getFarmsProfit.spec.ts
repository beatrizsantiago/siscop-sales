import GetFarmsProfitUseCase from '../../../src/usecases/sale/getFarmsProfit';

describe('GetFarmsProfitUseCase', () => {
  const mockRepository = {
    findAll: jest.fn(),
  };

  const makeSut = () => new GetFarmsProfitUseCase(mockRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return top 10 farms by profit with DONE status only', async () => {
    const fakeSales = [
      {
        status: 'DONE',
        total_value: 100,
        farm: { id: '1', name: 'Fazenda A' }
      },
      {
        status: 'PENDING',
        total_value: 999,
        farm: { id: '2', name: 'Fazenda B' }
      },
      {
        status: 'DONE',
        total_value: 300,
        farm: { id: '1', name: 'Fazenda A' }
      },
      {
        status: 'DONE',
        total_value: 200,
        farm: { id: '3', name: 'Fazenda C' }
      }
    ];

    mockRepository.findAll.mockResolvedValue(fakeSales);

    const sut = makeSut();
    const result = await sut.execute();

    expect(result).toEqual([
      {
        farmId: '1',
        farmName: 'Fazenda A',
        profit: 400,
      },
      {
        farmId: '3',
        farmName: 'Fazenda C',
        profit: 200,
      }
    ]);

    expect(result.length).toBeLessThanOrEqual(10);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });
});

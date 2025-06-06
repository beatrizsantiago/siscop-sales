import GetAllFarmsUseCase from '../../../src/usecases/farm/getAllFarms';
import Farm from '../../../src/domain/entities/Farm';

describe('GetAllFarmsUseCase', () => {
  it('should return a list of farms from the repository', async () => {
    const mockFarmList = [
      new Farm('1', 'Fazenda A', { _lat: 0, _long: 0 }, []),
      new Farm('2', 'Fazenda B', { _lat: 1, _long: 1 }, []),
    ];

    const mockRepository = {
      getAll: jest.fn().mockResolvedValue(mockFarmList),
    };

    const useCase = new GetAllFarmsUseCase(mockRepository);

    const result = await useCase.execute();

    expect(mockRepository.getAll).toHaveBeenCalled();
    expect(result).toEqual(mockFarmList);
  });
});

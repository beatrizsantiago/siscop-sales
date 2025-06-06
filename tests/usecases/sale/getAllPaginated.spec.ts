import GetAllPaginatedSaleUseCase from '../../../src/usecases/sale/getAllPaginated';
import { DocumentSnapshot } from 'firebase/firestore';

describe('GetAllPaginatedSaleUseCase', () => {
  const mockRepository = {
    getAllPaginated: jest.fn(),
  };

  const makeSut = () => new GetAllPaginatedSaleUseCase(mockRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return sales from repository without lastDoc', async () => {
    const fakeList = { list: ['sale1', 'sale2'], lastDoc: {}, hasMore: true };
    mockRepository.getAllPaginated.mockResolvedValue(fakeList);

    const sut = makeSut();
    const result = await sut.execute();

    expect(mockRepository.getAllPaginated).toHaveBeenCalledWith(undefined);
    expect(result).toEqual(fakeList);
  });

  it('should return sales from repository with lastDoc', async () => {
    const lastDoc = {} as DocumentSnapshot;
    const fakeList = { list: ['sale3'], lastDoc, hasMore: false };
    mockRepository.getAllPaginated.mockResolvedValue(fakeList);

    const sut = makeSut();
    const result = await sut.execute(lastDoc);

    expect(mockRepository.getAllPaginated).toHaveBeenCalledWith(lastDoc);
    expect(result).toEqual(fakeList);
  });
});

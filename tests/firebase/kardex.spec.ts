import { FirebaseKardex } from '../../src/firebase/kardex';
import { getDocs, writeBatch, doc } from 'firebase/firestore';

jest.mock('firebase/firestore', () => {
  const update = jest.fn();
  const commit = jest.fn();

  return {
    collection: jest.fn(),
    doc: jest.fn((_, id) => ({ id })),
    query: jest.fn(),
    where: jest.fn(),
    getDocs: jest.fn(),
    writeBatch: jest.fn(() => ({
      update,
      commit,
    })),
  };
});

describe('FirebaseKardex', () => {
  const kardex = new FirebaseKardex();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should sum available amount from kardex READY', async () => {
    (getDocs as jest.Mock).mockResolvedValueOnce({
      forEach: (cb: any) => {
        cb({ data: () => ({ amount: 10 }) });
        cb({ data: () => ({ amount: 5 }) });
      },
    });

    const result = await kardex.getAvailableAmount('farm1', 'prod1');
    expect(result).toBe(15);
  });

  it('should consume stock by updating batch with remaining amount', async () => {
    const mockDocs = [
      {
        id: 'doc1',
        data: () => ({ amount: 7 }),
      },
      {
        id: 'doc2',
        data: () => ({ amount: 5 }),
      },
    ];

    const update = jest.fn();
    const commit = jest.fn();

    (getDocs as jest.Mock).mockResolvedValueOnce({ docs: mockDocs });
    (writeBatch as jest.Mock).mockReturnValueOnce({ update, commit });

    await kardex.consumeStock('farm1', 'prod1', 10);

    expect(update).toHaveBeenCalledTimes(2);
    expect(commit).toHaveBeenCalled();
  });

  it('should restore stock by updating first kardex doc', async () => {
    const mockDocs = [
      {
        id: 'kardex',
        data: () => ({ amount: 3 }),
      },
    ];

    const update = jest.fn();
    const commit = jest.fn();

    (getDocs as jest.Mock).mockResolvedValueOnce({ docs: mockDocs });
    (writeBatch as jest.Mock).mockReturnValueOnce({ update, commit });

    const originalDoc = doc;
    (doc as jest.Mock).mockImplementation((_, id) => ({ id }));

    await kardex.restoreStock('farm1', 'prod1', 4);

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'kardex' }),
      { amount: 7 }
    );
    expect(commit).toHaveBeenCalled();

    (doc as jest.Mock).mockImplementation(originalDoc);
  });
});

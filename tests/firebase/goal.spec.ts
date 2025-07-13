import { firebaseGoal } from '../../src/firebase/goal';
import { doc, getDocs, updateDoc } from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  query: jest.fn((...args) => args),
  where: jest.fn(),
  orderBy: jest.fn(),
  getDocs: jest.fn(),
  updateDoc: jest.fn(),
  Timestamp: {
    fromDate: jest.fn((date: Date) => ({ _seconds: Math.floor(date.getTime() / 1000), toDate: () => date })),
  },
}));

describe('FirebaseGoal.findPendingSalesGoals', () => {
  const farmId = 'farm123';
  const goalId = 'goal456';
  const beforeDate = new Date('2025-07-13T10:00:00Z');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should query SALE goals and return an array of Goal', async () => {
    const mockDocs = [
      { id: '1', data: () => ({ farm_id: {}, kind: 'SALE', finished: false, created_at: { toDate: () => beforeDate } }) },
      { id: '2', data: () => ({ farm_id: {}, kind: 'SALE', finished: false, created_at: { toDate: () => beforeDate } }) },
    ];
    (getDocs as jest.Mock).mockResolvedValue({ docs: mockDocs });

    const result = await firebaseGoal.findPendingSalesGoals(farmId, beforeDate);

    expect(result).toHaveLength(2);
  });

  it('markAsFinished should update the goal document to finished', async () => {
    const fakeDocRef = {} as any;
    (doc as jest.Mock).mockReturnValue(fakeDocRef);

    await firebaseGoal.markAsFinished(goalId);

    expect(updateDoc).toHaveBeenCalledWith(fakeDocRef, { finished: true });
  });

  it('markAsFinished should propagate errors', async () => {
    const error = new Error('update failed');
    (updateDoc as jest.Mock).mockRejectedValueOnce(error);

    await expect(firebaseGoal.markAsFinished(goalId)).rejects.toThrow('update failed');
  });
});

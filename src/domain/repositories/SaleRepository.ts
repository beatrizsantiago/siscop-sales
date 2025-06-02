import { DocumentSnapshot } from 'firebase/firestore';
import Sale from '@domain/entities/Sale';

export interface SaleRepository {
  getAllPaginated(lastDoc?: DocumentSnapshot): Promise<{
    list: Sale[];
    lastDoc?: DocumentSnapshot;
    hasMore: boolean;
  }>;
};

import { DocumentReference, DocumentSnapshot, Timestamp } from 'firebase/firestore';
import Sale from '@domain/entities/Sale';

export interface SaleRepository {
  add(sale: Sale): Promise<Sale>;
  getAllPaginated(lastDoc?: DocumentSnapshot): Promise<{
    list: Sale[];
    lastDoc?: DocumentSnapshot;
    hasMore: boolean;
  }>;
  findById(id: string): Promise<any>;
  updateStatus(id: string, status: string): Promise<void>;
  findAll(): Promise<Sale[]>;
  sumAmountSince(farmId: string, productId: DocumentReference, since: Timestamp): Promise<number>;
};

import { KardexRepository } from '@domain/repositories/KardexRepository';
import { collection, query, where, getDocs, doc, writeBatch } from 'firebase/firestore';

import { firestore } from './config';

export class FirebaseKardex implements KardexRepository {
  async getAvailableAmount(farmId: string, productId: string): Promise<number> {
    const farmRef = doc(firestore, 'farms', farmId);
    const productRef = doc(firestore, 'products', productId);

    const q = query(
      collection(firestore, 'kardex'),
      where('farm_id', '==', farmRef),
      where('product_id', '==', productRef),
      where('state', '==', 'READY')
    );

    const snapshot = await getDocs(q);
    let total = 0;
    snapshot.forEach((doc) => {
      const data = doc.data();
      total += data.amount || 0;
    });

    return total;
  };

  async consumeStock(farmId: string, productId: string, amount: number): Promise<void> {
    const farmRef = doc(firestore, 'farms', farmId);
    const productRef = doc(firestore, 'products', productId);

    const q = query(
      collection(firestore, 'kardex'),
      where('farm_id', '==', farmRef),
      where('product_id', '==', productRef),
      where('state', '==', 'READY')
    );

    const snapshot = await getDocs(q);
    const batch = writeBatch(firestore);
    let toConsume = amount;

    for (const kardexDoc of snapshot.docs) {
      if (toConsume <= 0) break;

      const data = kardexDoc.data();
      const current = data.amount || 0;
      const consume = Math.min(current, toConsume);
      const ref = doc(firestore, 'kardex', kardexDoc.id);

      const newAmount = current - consume;
      batch.update(ref, { amount: newAmount });

      toConsume -= consume;
    }

    await batch.commit();
  };

  async restoreStock(farmId: string, productId: string, amount: number): Promise<void> {
    const farmRef = doc(firestore, 'farms', farmId);
    const productRef = doc(firestore, 'products', productId);

    const q = query(
      collection(firestore, 'kardex'),
      where('farm_id', '==', farmRef),
      where('product_id', '==', productRef),
      where('state', '==', 'READY')
    );

    const snapshot = await getDocs(q);
    const batch = writeBatch(firestore);

    const firstDoc = snapshot.docs[0];
    const current = firstDoc.data().amount || 0;
    batch.update(doc(firestore, 'kardex', firstDoc.id), {
      amount: current + amount
    });

    await batch.commit();
  }
};

export const firebaseKardex = new FirebaseKardex();

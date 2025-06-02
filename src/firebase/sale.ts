import { SaleRepository } from '@domain/repositories/SaleRepository';
import {
  collection, DocumentReference, DocumentSnapshot,
  getDoc, getDocs, limit, orderBy, query, startAfter,
} from 'firebase/firestore';
import Sale from '@domain/entities/Sale';
import Product from '@domain/entities/Product';
import Farm from '@domain/entities/Farm';

import { firestore } from './config';

const PAGE_SIZE = 10;

class FirebaseSale implements SaleRepository {
  async getAllPaginated(lastDoc?: DocumentSnapshot): Promise<{
    list: Sale[];
    lastDoc?: DocumentSnapshot;
    hasMore: boolean;
  }> {
    const saleRef = collection(firestore, 'sales');

    let q = query(
      saleRef,
      orderBy('created_at', 'desc'),
      limit(PAGE_SIZE),
    );

    if (lastDoc) {
      q = query(
        saleRef,
        orderBy('created_at', 'desc'),
        startAfter(lastDoc),
        limit(PAGE_SIZE),
      );
    }

    const snapshot = await getDocs(q);

    const sales = await Promise.all(snapshot.docs.map(async (docSnap) => {
      const data = docSnap.data();

      const farmRef = data.farm_id as DocumentReference;
      let farm: Farm | null = null;

      if (farmRef) {
        const farmSnap = await getDoc(farmRef);
        if (farmSnap.exists()) {
          const farmData = farmSnap.data();
          farm = new Farm(
            farmRef.id,
            farmData.name,
            farmData.geolocation,
            farmData.available_products
          );
        }
      }

      const items = await Promise.all(
        (data.items || []).map(async (itemData: any) => {
          const productRef = itemData.product_id as DocumentReference;
          let product: Product | null = null;

          if (productRef) {
            const productSnap = await getDoc(productRef);
            if (productSnap.exists()) {
              const productData = productSnap.data();
              product = new Product(
                productRef.id,
                productData.name,
                productData.unit_value,
                productData.cycle_days
              );
            }
          }

          return {
            product: product!,
            amount: itemData.amount,
            unit_value: itemData.unit_value,
            total_value: itemData.total_value,
          };
        })
      );

      return new Sale(
        docSnap.id,
        farm!,
        data.status,
        data.total_value,
        items,
        data.created_at.toDate()
      );
    }));

    const newLastDoc = snapshot.docs[snapshot.docs.length - 1] ?? undefined;

    return {
      list: sales,
      lastDoc: newLastDoc,
      hasMore: snapshot.docs.length === PAGE_SIZE,
    };
  };
};

export const firebaseSale = new FirebaseSale();

import { SaleRepository } from '@domain/repositories/SaleRepository';
import {
  addDoc, collection, doc, DocumentData, DocumentReference, DocumentSnapshot,
  getDoc, getDocs, limit, orderBy, query, startAfter,  Timestamp,
  updateDoc, where
} from 'firebase/firestore';
import Sale from '@domain/entities/Sale';
import Product from '@domain/entities/Product';
import Farm from '@domain/entities/Farm';

import { firestore } from './config';

const PAGE_SIZE = 10;

class FirebaseSale implements SaleRepository {
  async add(sale: Sale): Promise<Sale> {
    const saleData = {
      farm_id: doc(firestore, 'farms', sale.farm.id),
      status: sale.status,
      total_value: sale.total_value,
      items: sale.items.map((item) => ({
        amount: item.amount,
        product_id: doc(firestore, 'products', item.product.id),
        unit_value: item.unit_value,
        total_value: item.total_value,
      })),
      created_at: Timestamp.fromDate(sale.created_at),
    };

    const docRef = await addDoc(collection(firestore, 'sales'), saleData);
    sale.id = docRef.id;
    return sale;
  };

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

  async findById(id: string): Promise<any> {
    const ref = doc(firestore, 'sales', id);
    const snap = await getDoc(ref);
    return snap.data();
  };

  async updateStatus(id: string, status: string): Promise<void> {
    const ref = doc(firestore, 'sales', id);
    await updateDoc(ref, { status });
  };

  async findAll(): Promise<Sale[]> {
    const snapshot = await getDocs(collection(firestore, 'sales'));

    return await Promise.all(snapshot.docs.map(async doc => {
      const data = doc.data();
      const farmRef = data.farm_id as DocumentReference;
      const farmSnap = await getDoc(farmRef);
      const farmData = farmSnap.data();

      const farm = new Farm(
        farmRef.id,
        farmData?.name,
        farmData?.geolocation,
        [],
      );

      const items = await Promise.all(data.items.map(async (item: any) => {
        const productRef = item.product_id as DocumentReference;
        const productSnap = await getDoc(productRef);
        const productData = productSnap.data();

        const product = new Product(
          productRef.id,
          productData?.name,
          productData?.unit_value,
          productData?.cycle_days
        );

        return {
          amount: item.amount,
          total_value: item.total_value,
          unit_value: item.unit_value,
          product,
        };
      }));

      return new Sale(
        doc.id,
        farm,
        data.status,
        data.total_value,
        items,
        data.created_at.toDate()
      );
    }));
  }

  async sumAmountSince(farmId: string, productId: DocumentReference, since: Timestamp): Promise<number> {
    const salesRef = collection(firestore, 'sales');
    const farmRef = doc(firestore, 'farms', farmId);

    const q = query(
      salesRef,
      where('farm_id', '==', farmRef),
      where('created_at', '>=', since)
    );

    const snap = await getDocs(q);
    let total = 0;

    snap.docs.forEach(docSnap => {
      const data = docSnap.data() as DocumentData;
      const items: Array<{ product_id: DocumentReference; amount: number }> = data.items;
      for (const item of items) {
        if ((item.product_id as DocumentReference).id === productId.id) {
          total += typeof item.amount === 'number' ? item.amount : 0;
        }
      }
    });

    return total;
  }
};

export const firebaseSale = new FirebaseSale();

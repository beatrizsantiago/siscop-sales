import { FarmRepository } from '@domain/repositories/FarmRepository';
import {
  collection, doc, DocumentReference, getDoc, getDocs, query, where,
} from 'firebase/firestore';
import Farm from '@domain/entities/Farm';
import Product from '@domain/entities/Product';

import { firestore } from './config';

class FirebaseFarm implements FarmRepository {
  async getAll(): Promise<Farm[]> {
    const farmsQuery = query(collection(firestore, 'farms'));
    const snapshot = await getDocs(farmsQuery);

    const farms: Farm[] = [];

    for (const docSnapshot of snapshot.docs) {
      const farmData = docSnapshot.data();
      const farmId = docSnapshot.id;

      const farmRef = doc(firestore, 'farms', farmId);

      const productRefs = Array.isArray(farmData.available_products)
        ? farmData.available_products.filter((ref) => ref && typeof ref === 'object' && 'id' in ref)
        : [];

      const allProducts: Product[] = await Promise.all(
        productRefs.map(async (ref: DocumentReference) => {
          const productSnap = await getDoc(ref);
          if (productSnap.exists()) {
            const data = productSnap.data();
            return new Product(productSnap.id, data.name, data.unit_value, data.cycle_days);
          }
          return null;
        })
      ).then((results) => results.filter((p): p is Product => p !== null));

      const filteredProducts: Product[] = [];

      for (const product of allProducts) {
        const productRef = doc(firestore, 'products', product.id);

        const kardexQuery = query(
          collection(firestore, 'kardex'),
          where('farm_id', '==', farmRef),
          where('product_id', '==', productRef),
          where('state', '==', 'READY')
        );

        const kardexSnap = await getDocs(kardexQuery);
        if (!kardexSnap.empty) {
          filteredProducts.push(product);
        }
      }

      const farm = new Farm(farmId, farmData.name, farmData.geolocation, filteredProducts);
      farms.push(farm);
    }

    return farms;
  }
};

export const firebaseFarm = new FirebaseFarm();

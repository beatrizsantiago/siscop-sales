import Farm from './Farm';
import Product from './Product';

type Item = {
  amount: number;
  product: Product;
  total_value: number;
  unit_value: number;
};

class Sale {
  id: string;
  farm: Farm;
  status: string;
  total_value: number;
  items: Item[];
  created_at: Date;

  constructor(id: string, farm: Farm, status: string, total_value: number, items: Item[], created_at: Date) {
    this.id = id;
    this.farm = farm;
    this.status = status;
    this.total_value = total_value;
    this.items = items;
    this.created_at = created_at;
  };
};

export default Sale;

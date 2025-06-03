import { SaleRepository } from '@domain/repositories/SaleRepository';
import { ProductProfit } from '@generalTypes/products';

export class GetProductProfitUseCase {
  constructor(private saleRepository: SaleRepository) {}

  async execute(): Promise<ProductProfit[]> {
    const sales = await this.saleRepository.findAll();

    const profitMap: Record<string, ProductProfit> = {};

    for (const sale of sales) {
      if (sale.status !== 'DONE') continue;
      for (const item of sale.items) {
        const { product, total_value } = item;

        if (!profitMap[product.id]) {
          profitMap[product.id] = {
            productId: product.id,
            productName: product.name,
            profit: 0,
          };
        }

        profitMap[product.id].profit += total_value;
      }
    }

    return Object.values(profitMap).sort((a, b) => b.profit - a.profit).slice(0, 10);
  }
};

export default GetProductProfitUseCase;

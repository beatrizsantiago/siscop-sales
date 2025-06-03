import { SaleRepository } from '@domain/repositories/SaleRepository';
import { FarmProfit } from '@generalTypes/farms';

export class GetFarmsProfitUseCase {
  constructor(private saleRepository: SaleRepository) {}

  async execute(): Promise<FarmProfit[]> {
    const sales = await this.saleRepository.findAll();

    const profitMap: Record<string, FarmProfit> = {};

    for (const sale of sales) {
      if (sale.status !== 'DONE') continue;

      const { farm, total_value } = sale;

      if (!profitMap[farm.id]) {
        profitMap[farm.id] = {
          farmId: farm.id,
          farmName: farm.name,
          profit: 0,
        };
      }

      profitMap[farm.id].profit += total_value;
    }

    return Object.values(profitMap).sort((a, b) => b.profit - a.profit).slice(0, 10);
  };
};

export default GetFarmsProfitUseCase;

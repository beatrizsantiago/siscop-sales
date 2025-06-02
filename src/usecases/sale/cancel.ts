import { SaleRepository } from '@domain/repositories/SaleRepository';
import { KardexRepository } from '@domain/repositories/KardexRepository';

class CancelSaleUseCase {
  constructor(
    private saleRepository: SaleRepository,
    private kardexRepository: KardexRepository,
  ) {}

  async execute(saleId: string): Promise<void> {
    const sale = await this.saleRepository.findById(saleId);

    await this.saleRepository.updateStatus(saleId, 'CANCELLED');

    for (const item of sale.items) {
      const farmId = sale.farm_id.id;
      const productId = item.product_id.id;

      await this.kardexRepository.restoreStock(farmId, productId, item.amount);
    }
  }
}

export default CancelSaleUseCase;

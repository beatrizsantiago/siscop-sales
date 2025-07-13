import Farm from '@domain/entities/Farm';
import Product from '@domain/entities/Product';
import Sale from '@domain/entities/Sale';
import Notification from '@domain/entities/Notification';
import { SaleRepository } from '@domain/repositories/SaleRepository';
import { KardexRepository } from '@domain/repositories/KardexRepository';
import { GoalRepository } from '@domain/repositories/GoalRepository';
import { NotificationRepository } from '@domain/repositories/NotificationRepository';

type AddParams = {
  farm: Farm,
  items: {
    amount: number;
    product: Product;
    unit_value: number;
  }[]
};

class AddSaleUseCase {
  constructor(
    private saleRepository: SaleRepository,
    private kardexRepository: KardexRepository,
    private goalRepository: GoalRepository,
    private notificationRepository: NotificationRepository,
  ) {}

  async execute(params: AddParams) {
    for (const item of params.items) {
      const available = await this.kardexRepository.getAvailableAmount(params.farm.id, item.product.id);
      if (available < item.amount) {
        throw new Error(`INSUFFICIENT_STOCK:${item.product.name}`);
      }
    }

    const sale = new Sale(
      '',
      params.farm,
      'DONE',
      params.items.reduce((acc, item) => acc + item.amount * item.unit_value, 0),
      params.items.map(item => ({
        amount: item.amount,
        product: item.product,
        total_value: item.amount * item.unit_value,
        unit_value: item.unit_value,
      })),
      new Date(),
    );

    const savedSale = await this.saleRepository.add(sale);

    for (const item of params.items) {
      await this.kardexRepository.consumeStock(params.farm.id, item.product.id, item.amount);
    }

    const pendingGoals = await this.goalRepository.findPendingSalesGoals(
      savedSale.farm.id,
      new Date()
    );

    for (const goal of pendingGoals) {
      let allItemsMet = true;

      for (const goalItem of goal.items) {
        const totalSold = await this.saleRepository.sumAmountSince(
          savedSale.farm.id,
          goalItem.product_id,
          goal.created_at
        );

        if (totalSold < goalItem.amount) {
          allItemsMet = false;
          break;
        }
      }

      if (allItemsMet) {
        await this.goalRepository.markAsFinished(goal.id);

        await this.notificationRepository.create(
          new Notification(
            '',
            'SALE',
            savedSale.farm.name,
            new Date()
          )
        );
      };
    };

    return savedSale;
  }
}

export default AddSaleUseCase;

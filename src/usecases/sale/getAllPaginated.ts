import { SaleRepository } from '@domain/repositories/SaleRepository';
import { DocumentSnapshot } from 'firebase/firestore';

class GetAllPaginatedSaleUseCase {
  constructor(private repository: SaleRepository) {}

  async execute(lastDoc?: DocumentSnapshot) {
    const list = await this.repository.getAllPaginated(lastDoc);
    return list;
  };
};

export default GetAllPaginatedSaleUseCase;

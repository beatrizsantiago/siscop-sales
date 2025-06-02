export interface KardexRepository {
  getAvailableAmount(farmId: string, productId: string): Promise<number>;
  consumeStock(farmId: string, productId: string, amount: number): Promise<void>;
  restoreStock(farmId: string, productId: string, amount: number): Promise<void>;
}

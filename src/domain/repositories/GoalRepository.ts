import Goal from '@domain/entities/Goal';

export interface GoalRepository {
  findPendingSalesGoals(
    farmId: string,
    before: Date
  ): Promise<Goal[]>;

  markAsFinished(goalId: string): Promise<void>;
};

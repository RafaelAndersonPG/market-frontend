import { TransactionType } from "../enum/TransactionType";

export interface TransactionDto {
  id: number;
  amount: number;
  type: TransactionType;
  description: string;
  date: string;
}
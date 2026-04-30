import { TransactionType } from "../enum/TransactionType";

export interface TransactionRequestDto {
    accountId: number;
    amount: number;
    type: TransactionType;
    description: string;
}
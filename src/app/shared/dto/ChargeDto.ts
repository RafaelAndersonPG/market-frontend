export interface ChargeResponseDTO {
    id: number;
    name: string;
    description: string;
    amount: number;
}

export interface ChargeRequestDTO {
    name: string;
    description: string;
    amount: number;
}
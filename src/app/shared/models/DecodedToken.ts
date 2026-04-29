export interface DecodedToken {
    sub: string;
    nombre: string;
    apellido: string;
    authorities: string[];
    exp: number;
    iat: number;
}
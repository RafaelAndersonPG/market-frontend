import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { Observable, tap } from 'rxjs';
import { TransactionDto } from '../app/shared/dto/TransactionDto';
import { TransactionRequestDto } from '../app/shared/dto/TransactionRequestDto';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}api/transaccion`;

  getTransactions(stallId: number): Observable<TransactionDto[]> {
    return this.http.get<TransactionDto[]>(`${this.API_URL}/${stallId}/stall`).pipe(
      tap(data => {
        console.log('Transacciones: ', data);
      })
    );
  }

  createTransaction(data: TransactionRequestDto): Observable<void> {
    return this.http.post<void>(`${this.API_URL}`, data).pipe(
      tap(() => console.log('Transacción creada'))
    );
  }
}
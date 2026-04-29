import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { Observable, tap } from 'rxjs';
import { TransactionDto } from '../app/shared/dto/TransactionDto';

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
}
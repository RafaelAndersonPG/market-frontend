import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { Observable, tap } from 'rxjs';
import { TransactionDto } from '../app/shared/dto/TransactionDto';

@Injectable({
  providedIn: 'root'
})
export class DebtsService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}api/deuda`;

  getDebtsByStall(stallId: number): Observable<TransactionDto[]> {
    return this.http.get<TransactionDto[]>(`${this.API_URL}/pendientes/${stallId}`).pipe(
      tap(data => {
        console.log('Deudas: ', data);
      })
    );
  }

  createDebt(debt: any): Observable<any> {
    return this.http.post(`${this.API_URL}`, debt).pipe(
      tap(data => console.log('Deuda creada:', data))
    );
  }
}
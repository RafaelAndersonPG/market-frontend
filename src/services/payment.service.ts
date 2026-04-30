import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { Observable, tap } from 'rxjs';
import { PaymentRequestDto } from '../app/shared/dto/PaymentRequestDto';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}api/pago`;

  create(dto: PaymentRequestDto): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/por-deuda`, dto).pipe(
      tap(data => {
        console.log('Transacciones: ', data);
      })
    );
  }
}
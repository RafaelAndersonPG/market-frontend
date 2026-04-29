import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}api/cuenta`;

  getAccount(stallId: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/stall/${stallId}`).pipe(
      tap(data => {
        console.log('Cuenta: ', data);
      })
    );
  }
}
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { Observable, tap } from 'rxjs';
import { PuestoDto } from '../app/shared/models/PuestoDto';

@Injectable({
  providedIn: 'root'
})
export class StallService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}api/puesto`;

  getAll(): Observable<PuestoDto[]> {
    return this.http.get<PuestoDto[]>(this.API_URL).pipe(
      tap(data => {
        console.log('Puestos: ', data);
      })
    );
  }
}
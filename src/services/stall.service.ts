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
    return this.http.get<PuestoDto[]>(this.API_URL);
  }

  create(data: any): Observable<PuestoDto> {
    return this.http.post<PuestoDto>(this.API_URL, data);
  }

  update(id: number, data: any): Observable<PuestoDto> {
    return this.http.put<PuestoDto>(`${this.API_URL}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { Observable, tap } from 'rxjs';
import { ChargeRequestDTO, ChargeResponseDTO } from '../app/shared/dto/ChargeDto';

@Injectable({
    providedIn: 'root'
})
export class ChargeService {

    private http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}api/cargo`;

    getAll(): Observable<ChargeResponseDTO[]> {
        return this.http.get<ChargeResponseDTO[]>(this.API_URL).pipe(
            tap(data => console.log('Cargos:', data))
        );
    }

    create(charge: ChargeRequestDTO): Observable<ChargeResponseDTO> {
        return this.http.post<ChargeResponseDTO>(this.API_URL, charge).pipe(
            tap(data => console.log('Creado:', data))
        );
    }

    update(id: number, charge: ChargeRequestDTO): Observable<ChargeResponseDTO> {
        return this.http.put<ChargeResponseDTO>(`${this.API_URL}/${id}`, charge).pipe(
            tap(data => console.log('Actualizado:', data))
        );
    }


    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
            tap(() => console.log('Eliminado:', id))
        );
    }
}
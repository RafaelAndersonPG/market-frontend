import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ChargeService } from '../../services/charge.service';
import { BehaviorSubject, catchError, Observable, of, switchMap, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { SwalService } from '../shared/util/SwalService';

@Component({
  selector: 'app-charge',
  imports: [CommonModule],
  templateUrl: './charge.html',
  styleUrl: './charge.scss',
})
export class Charge implements OnInit {

  private chargeService = inject(ChargeService);
  private swal = inject(SwalService);

  private refresh$ = new BehaviorSubject<void>(undefined);
  charges$!: Observable<any[]>;

  ngOnInit(): void {
    this.loadCharges();
  }

  loadCharges() {
    this.charges$ = this.refresh$.pipe(
      switchMap(() => this.chargeService.getAll()),
      catchError(err => {
        console.log(err);
        return of([]);
      })
    );
  }

  createCharge() {
    Swal.fire({
      title: 'Nuevo cargo',
      html:
        `<input id="name" class="swal2-input" placeholder="Nombre" autocomplete="off">
       <input id="description" class="swal2-input" placeholder="Descripción" autocomplete="off">`,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      preConfirm: () => {
        const name = (document.getElementById('name') as HTMLInputElement).value;
        const description = (document.getElementById('description') as HTMLInputElement).value;

        return { name, description };
      }
    }).then(result => {
      if (result.isConfirmed) {
        this.chargeService.create(result.value).pipe(
          tap(() => {
            this.reload();
            this.swal.success('Creado', 'Cargo registrado');
          }),
          catchError(err => {
            this.swal.error('Error', err.error?.message || 'Error al crear');
            return of(null);
          })
        ).subscribe();
      }
    });
  }

  editCharge(c: any) {
    Swal.fire({
      title: 'Editar cargo',
      html:
        `<input id="name" class="swal2-input" value="${c.name}" autocomplete="off">
       <input id="description" class="swal2-input" value="${c.description}" autocomplete="off">`,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      preConfirm: () => {
        const name = (document.getElementById('name') as HTMLInputElement).value;
        const description = (document.getElementById('description') as HTMLInputElement).value;

        return { name, description };
      }
    }).then(result => {
      if (result.isConfirmed) {

        this.chargeService.update(c.id, result.value).pipe(
          tap(() => {
            this.reload();
            this.swal.success('Actualizado', 'Cargo actualizado');
          }),
          catchError(err => {
            this.swal.warning('No se pudo actualizar', err.error?.message);
            return of(null);
          })
        ).subscribe();
      }
    });
  }

  deleteCharge(id: number) {
    Swal.fire({
      title: '¿Eliminar cargo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
    }).then(result => {
      if (result.isConfirmed) {
        this.chargeService.delete(id).pipe(
          tap(() => {
            this.reload();
            this.swal.success('Eliminado', 'Cargo eliminado');
          }),
          catchError(err => {
            this.swal.error('No permitido', err.error?.message);
            return of(null);
          })
        ).subscribe();
      }
    });
  }

  reload() {
    this.refresh$.next();
  }
}

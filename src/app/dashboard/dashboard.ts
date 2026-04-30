import { Component, inject, OnInit } from '@angular/core';
import { StallService } from '../../services/stall.service';
import { Observable, BehaviorSubject, switchMap, catchError, of, tap } from 'rxjs';
import { PuestoDto } from '../shared/models/PuestoDto';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

  private stallService = inject(StallService);
  private router = inject(Router);

  private refresh$ = new BehaviorSubject<void>(undefined);

  puestos$!: Observable<PuestoDto[]>;

  ngOnInit(): void {
    this.loadPuestos();
  }

  loadPuestos() {
    this.puestos$ = this.refresh$.pipe(
      switchMap(() => this.stallService.getAll()),
      catchError(() => of([]))
    );
  }

  reload() {
    this.refresh$.next();
  }

  seleccionarPuesto(puesto: any) {
    this.router.navigate(['/puesto'], {
      state: { puesto }
    });
  }

  createPuesto() {
    Swal.fire({
      title: 'Nuevo puesto',
      input: 'text',
      inputPlaceholder: 'Nombre del puesto',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      preConfirm: (name) => {
        if (!name) {
          Swal.showValidationMessage('El nombre es obligatorio');
        }
        return { name };
      }
    }).then(result => {
      if (!result.isConfirmed) return;

      this.stallService.create(result.value).pipe(
        tap(() => {
          this.reload();
          Swal.fire('OK', 'Puesto creado', 'success');
        }),
        catchError(err => {
          Swal.fire('Error', err.error || 'Error al crear', 'error');
          return of(null);
        })
      ).subscribe();
    });
  }

  editPuesto(puesto: any) {
    Swal.fire({
      title: 'Editar puesto',
      input: 'text',
      inputValue: puesto.name,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      preConfirm: (name) => {
        if (!name) {
          Swal.showValidationMessage('El nombre es obligatorio');
        }
        return { name };
      }
    }).then(result => {
      if (!result.isConfirmed) return;

      this.stallService.update(puesto.id, result.value).pipe(
        tap(() => {
          this.reload();
          Swal.fire('OK', 'Puesto actualizado', 'success');
        }),
        catchError(err => {
          Swal.fire('Error', err.error || 'Error al actualizar', 'error');
          return of(null);
        })
      ).subscribe();
    });
  }

  // ---------------- DELETE ----------------
  deletePuesto(puesto: any) {
    Swal.fire({
      title: '¿Eliminar puesto?',
      text: `Se eliminará ${puesto.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar'
    }).then(result => {
      if (!result.isConfirmed) return;

      this.stallService.delete(puesto.id).pipe(
        tap(() => {
          this.reload();
          Swal.fire('Eliminado', 'Puesto eliminado', 'success');
        }),
        catchError(err => {
          Swal.fire('Error', err.error || 'No se pudo eliminar', 'error');
          return of(null);
        })
      ).subscribe();
    });
  }
}
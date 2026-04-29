import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { StallService } from '../../services/stall.service';
import { Observable } from 'rxjs';
import { PuestoDto } from '../shared/models/PuestoDto';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private stallService = inject(StallService);
  puestos$!: Observable<PuestoDto[]>;
  private router = inject(Router);

  ngOnInit(): void {
    this.cargarPuestos();
  }

  cargarPuestos() {
    this.puestos$ = this.stallService.getAll();
  }

  seleccionarPuesto(puesto: any) {
    this.router.navigate(['/puesto'], {
      state: { puesto }
    });
  }
}

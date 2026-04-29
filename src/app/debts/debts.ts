import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { DebtsService } from '../../services/debts.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-debts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './debts.html',
  styleUrl: './debts.scss',
})
export class Debts implements OnInit {

  private debtService = inject(DebtsService);
  private router = inject(Router);

  puesto: any;
  debts$!: Observable<any[]>;

  ngOnInit(): void {

    this.puesto = history.state.puesto;

    if (!this.puesto) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loadDebts();
  }

  loadDebts() {
    this.debts$ = this.debtService.getDebtsByStall(this.puesto.id).pipe(
      catchError(err => {
        console.log(err);
        return of([]);
      })
    );
  }

  back() {
    this.router.navigate(['/dashboard']);
  }
}
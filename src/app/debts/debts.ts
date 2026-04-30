import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, of, switchMap, take, tap } from 'rxjs';
import { DebtsService } from '../../services/debts.service';
import { ChargeService } from '../../services/charge.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { PaymentService } from '../../services/payment.service';
import { MonthLabel } from '../shared/enum/Meses';

@Component({
  selector: 'app-debts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './debts.html',
  styleUrl: './debts.scss',
})
export class Debts implements OnInit {

  private debtService = inject(DebtsService);
  private chargeService = inject(ChargeService);
  private paymentService = inject(PaymentService);
  private router = inject(Router);
  MonthMonthLabel = MonthLabel;
  puesto: any;
  account: any;

  private refresh$ = new BehaviorSubject<void>(undefined);

  debts$!: Observable<any[]>;
  charges$!: Observable<any[]>;

  ngOnInit(): void {
    this.account = history.state.account;
    this.puesto = history.state.puesto;

    if (!this.puesto || !this.account) {
      this.router.navigate(['/dashboard']);
      return;
    }

    console.log(this.account);
    console.log(this.puesto);
    
    this.loadCharges();
    this.loadDebts();
  }

  loadDebts() {
    this.debts$ = this.refresh$.pipe(
      switchMap(() => this.debtService.getDebtsByStall(this.puesto.id)),
      catchError(err => {
        console.log(err);
        return of([]);
      })
    );
  }

  loadCharges() {
    this.charges$ = this.chargeService.getAll().pipe(
      catchError(err => {
        console.log(err);
        return of([]);
      })
    );
  }

  reload() {
    this.refresh$.next();
  }

  back() {
    this.router.navigate(['/puesto'], {
      state: {
        puesto: this.puesto
      }
    });
  }

  createDebt() {

    this.charges$.pipe(take(1)).subscribe(charges => {

      const currentYear = new Date().getFullYear();

      Swal.fire({
        title: 'Registrar deuda',
        html: `
        <select id="charge" class="swal2-input">
          ${charges.map(c =>
          `<option value="${c.id}">${c.name}</option>`
        ).join('')}
        </select>

        <input id="year" type="number" class="swal2-input" placeholder="Año">
        <input id="month" type="number" class="swal2-input" placeholder="Mes (1-12)">
        <input id="amount" type="number" class="swal2-input" placeholder="Monto">
      `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',

        preConfirm: () => {

          const chargeId = (document.getElementById('charge') as HTMLSelectElement).value;
          const year = Number((document.getElementById('year') as HTMLInputElement).value);
          const month = Number((document.getElementById('month') as HTMLInputElement).value);
          const amount = Number((document.getElementById('amount') as HTMLInputElement).value);

          const error = this.validateDebtForm({
            chargeId,
            year,
            month,
            amount
          });

          if (error) {
            Swal.showValidationMessage(error);
            return;
          }

          return {
            chargeId: Number(chargeId),
            year,
            month,
            amount
          };
        }
      }).then(result => {

        if (!result.isConfirmed) return;

        const payload = {
          stallId: this.puesto.id,
          chargeId: result.value.chargeId,
          year: result.value.year,
          month: result.value.month,
          amount: result.value.amount,
        };

        this.debtService.createDebt(payload).pipe(
          tap(() => {
            this.reload();
            Swal.fire('Éxito', 'Deuda registrada', 'success');
          }),
          catchError(err => {
            Swal.fire('Error', err.error?.message || 'No se pudo registrar', 'error');
            return of(null);
          })
        ).subscribe();
      });

    });
  }

  private validateDebtForm(data: {
    chargeId: string;
    year: number;
    month: number;
    amount: number;
  }): string | null {

    const currentYear = new Date().getFullYear();

    if (!data.chargeId || !data.year || !data.month || !data.amount) {
      return 'Todos los campos son obligatorios';
    }

    if (data.year < currentYear) {
      return `El año no puede ser menor a ${currentYear}`;
    }

    if (data.month < 1 || data.month > 12) {
      return 'El mes debe estar entre 1 y 12';
    }

    if (data.amount <= 0) {
      return 'El monto debe ser mayor a 0';
    }

    return null;
  }

  payDebt(debt: any) {
    Swal.fire({
      title: '¿Pagar deuda?',
      text: `Se registrará el pago por S/ ${debt.amount}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, pagar'
    }).then(result => {

      if (!result.isConfirmed) return;

      const payload = {
        debtId: debt.id,
        accountId: this.account.id,
        description: `Pago - ${debt.chargeName}`
      };

      this.paymentService.create(payload).pipe(
        tap(() => {
          this.reload();
          Swal.fire('Pagado', 'La deuda fue cancelada', 'success');
        }),
        catchError(err => {
          Swal.fire('Error', err.error?.message || 'No se pudo pagar', 'error');
          return of(null);
        })
      ).subscribe();
    });
  }
}
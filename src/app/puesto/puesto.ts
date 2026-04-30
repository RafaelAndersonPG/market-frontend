import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { AccountService } from '../../services/account.service';
import { TransactionType } from '../shared/enum/TransactionType';
import { TransactionDto } from '../shared/dto/TransactionDto';
import Swal from 'sweetalert2';

export const TransactionTypeLabel: Record<TransactionType, string> = {
  [TransactionType.INCOME]: 'Ingreso',
  [TransactionType.EXPENSE]: 'Egreso'
};

@Component({
  selector: 'app-puesto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './puesto.html',
  styleUrl: './puesto.scss',
})
export class Puesto implements OnInit {

  private accountService = inject(AccountService);
  private transactionService = inject(TransactionService);
  private router = inject(Router);
  puesto: any;
  account$!: Observable<any>;
  showBalance = false;
  transactions$!: Observable<TransactionDto[]>;
  stallId!: number;
  loading = true;
  TransactionTypeLabel = TransactionTypeLabel;
  TransactionType = TransactionType;
  account: any;
  private refresh$ = new BehaviorSubject<void>(undefined);

  ngOnInit(): void {

    this.puesto = history.state.puesto;

    if (!this.puesto) {
      this.exitTransactions();
    }

    console.log(this.puesto);
    console.log('Puesto recibido:', this.puesto);
    this.loadAccount();
    this.loadTransactions();
    this.refresh$.next();
  }

  loadAccount() {
    this.account$ = this.accountService.getAccount(this.puesto.id).pipe(
      tap((data) => {
        console.log(data);
        this.account = data;
      }),
      catchError(err => {
        console.log(err);
        if (err.status === 404) {
          this.exitTransactions();
          return of(null);
        }
        return throwError(() => err);
      })
    );
  }

  loadTransactions() {
    this.transactions$ = this.refresh$.pipe(
      switchMap(() =>
        this.transactionService.getTransactions(this.puesto.id)
      ),
      catchError(err => {
        console.log(err);
        return of([]);
      })
    );
  }

  toggleBalance() {
    this.showBalance = !this.showBalance;
  }

  exitTransactions() {
    this.router.navigate(['/dashboard']);
  }

  goToDeudas() {
    this.router.navigate(['/deudas'], {
      state: {
        puesto: this.puesto,
        account: this.account
      }
    });
  }

  createIncome() {

    Swal.fire({
      title: 'Registrar ingreso',
      html:
        `<input id="amount" type="number" class="swal2-input" placeholder="Monto">
       <input id="description" class="swal2-input" placeholder="Descripción">`,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      preConfirm: () => {

        const amount = (document.getElementById('amount') as HTMLInputElement).value;
        const description = (document.getElementById('description') as HTMLInputElement).value;

        if (!amount) {
          Swal.showValidationMessage('El monto es obligatorio');
        }

        return {
          amount: Number(amount),
          description
        };
      }
    }).then(result => {

      if (!result.isConfirmed) return;

      const payload = {
        accountId: this.account.id,
        amount: result.value.amount,
        type: TransactionType.INCOME,
        description: result.value.description
      };

      this.transactionService.createTransaction(payload).pipe(
        tap(() => {
          this.refresh$.next();
          this.loadAccount();
          Swal.fire('Éxito', 'Ingreso registrado', 'success');
        }),
        catchError(err => {
          Swal.fire('Error', err.error?.message || 'No se pudo registrar', 'error');
          return of(null);
        })
      ).subscribe();
    });
  }
}
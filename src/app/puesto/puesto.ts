import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { Router } from '@angular/router';
import { catchError, Observable, of, throwError } from 'rxjs';
import { AccountService } from '../../services/account.service';
import { TransactionType } from '../shared/enum/TransactionType';
import { TransactionDto } from '../shared/dto/TransactionDto';

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

  ngOnInit(): void {

    this.puesto = history.state.puesto;

    if (!this.puesto) {
      this.exitTransactions();
    }

    console.log('Puesto recibido:', this.puesto);
    this.loadAccount();
    this.loadTransactions();
  }

  loadAccount() {
    this.account$ = this.accountService.getAccount(this.puesto.id).pipe(
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
    this.transactions$ = this.transactionService.getTransactions(this.puesto.id)
      .pipe(
        catchError(err => {
          console.log(err);
          if (err.status === 404) {
            this.exitTransactions();
            return of([]);
          }
          return throwError(() => err);
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
      state: { puesto: this.puesto }
    });
  }
}
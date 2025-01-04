import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../../../core/models/transaction.model';
import { TransactionService } from '../../../../core/services/transaction.service';

@Component({
  selector: 'app-order-panel',
  templateUrl: './order-panel.component.html',
  styleUrls: ['./order-panel.component.scss']
})
export class OrderPanelComponent implements OnInit {
  transactions: Transaction[] = [];
  errorMsg: string | null = null;

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.transactionService.getAllTransactions().subscribe({
      next: (data) => (this.transactions = data),
      error: (err) => (this.errorMsg = 'Nie udało się załadować zamówień')
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from '../../../../../core/services/transaction.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  orderDetails: any;
  errorMsg: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private orderDetailsService: TransactionService
  ) {}

  ngOnInit(): void {
    const orderUuid = this.route.snapshot.paramMap.get('orderUuid');

    if (orderUuid) {
      this.orderDetailsService.getOrderDetails(orderUuid).subscribe({
        next: (details) => {
          this.orderDetails = details;
          console.log('Order Details:', details);
        },
        error: (err) => {
          this.errorMsg = 'Nie udało się załadować szczegółów zamówienia.';
          console.error(err);
        }
      });
    }
  }
}

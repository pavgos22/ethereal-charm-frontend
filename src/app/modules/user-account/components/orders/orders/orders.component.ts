import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetOrdersResponse } from '../../../../core/models/order.model';
import { OrdersService } from '../../../../core/services/orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: GetOrdersResponse[] = [];
  errorMsg: null | string = null;

  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.ordersService.getOrders().subscribe({
      next: (orders) => {
        this.orders = [...orders];
      },
      error: (err) => {
        this.errorMsg = err;
      }
    });
  }

  navigateToDetails(uuid: string) {
    this.router.navigate([uuid], { relativeTo: this.route });
  }
}

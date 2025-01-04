import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl, { withCredentials: true });
  }

  getOrderDetails(orderUuid: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/order-details?orderUuid=${orderUuid}`,
      { withCredentials: true }
    );
  }
}

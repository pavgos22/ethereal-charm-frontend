import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import {
  CartResponse,
  GetCartResponse,
  PostCartBody
} from '../models/cart.module';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { ServerResponse } from '../models/server-response.model';

function extractResponse(
  response: HttpResponse<ServerResponse | GetCartResponse>
): CartResponse {
  if (!response.body) return { body: null, totalCount: 0 };

  const totalCount = Number(response.headers.get('X-Total-Count'));

  return { body: { ...response.body }, totalCount };
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  apiUrl = `${environment.apiUrl}/cart`;

  totalCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor(private http: HttpClient) {}

  getCartProducts(): Observable<CartResponse> {
    return this.http
      .get<GetCartResponse>(`${this.apiUrl}`, {
        withCredentials: true,
        observe: 'response'
      })
      .pipe(
        map(extractResponse),
        tap(({ totalCount }) => {
          this.totalCount$.next(totalCount);
        })
      );
  }

  addProductToCart(body: PostCartBody): Observable<CartResponse> {
    return this.http
      .post<ServerResponse>(`${this.apiUrl}`, body, {
        withCredentials: true,
        observe: 'response'
      })
      .pipe(
        map(extractResponse),
        tap(({ totalCount }) => {
          this.totalCount$.next(totalCount);
        })
      );
  }

  deleteProductFromCart(uuid: string): Observable<CartResponse> {
    const params = new HttpParams().append('uuid', uuid);
    return this.http
      .delete<ServerResponse>(`${this.apiUrl}`, {
        withCredentials: true,
        observe: 'response',
        params
      })
      .pipe(
        map(extractResponse),
        tap(({ totalCount }) => {
          this.totalCount$.next(totalCount);
        })
      );
  }
}

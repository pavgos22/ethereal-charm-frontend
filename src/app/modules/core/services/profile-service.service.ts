import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  updateShippingDetails(data: any): Observable<any> {
    return this.http
      .patch<any>(`${this.apiUrl}/shipping-details`, data, {
        withCredentials: true
      })
      .pipe(
        catchError((error) => {
          console.error('Error response:', error);
          return throwError(() => error);
        })
      );
  }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`, {
      withCredentials: true
    });
  }
}

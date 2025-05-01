import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicService {
  private apiUrl = `${environment.apiUrl}/public`;

  constructor(private http: HttpClient) {}

  checkEmail(email: string): Observable<{ exists: boolean; enabled: boolean }> {
    return this.http.post<{ exists: boolean; enabled: boolean }>(
      `${this.apiUrl}/check-email`,
      { email },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    );
  }
}

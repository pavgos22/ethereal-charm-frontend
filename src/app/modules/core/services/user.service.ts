import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RegisteredAccount } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<RegisteredAccount[]> {
    return this.http.get<RegisteredAccount[]>(`${this.apiUrl}/users`, {
      withCredentials: true
    });
  }

  getUserByUuid(uuid: string): Observable<RegisteredAccount> {
    return this.http.get<RegisteredAccount>(
      `${this.apiUrl}/users?show-details=true&uuid=${uuid}`,
      { withCredentials: true }
    );
  }
}

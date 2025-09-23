import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export { RegisterRequest };
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth'; 
  private tokenKey = 'apexgym_token';

  // Initialize signal as false
  isLoggedInSignal = signal<boolean>(false);

  constructor(private http: HttpClient) {
    // ✅ Access localStorage safely only in the constructor (browser)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(this.tokenKey);
      this.isLoggedInSignal.set(!!token);
    }
  }

  login(loginData: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData);
  }

  register(registerData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerData);
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSignal();
  }

  storeToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
      this.isLoggedInSignal.set(true);
    }
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
      this.isLoggedInSignal.set(false);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }
}






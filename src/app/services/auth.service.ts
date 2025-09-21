import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private apiUrl = 'http://localhost:5206/api/auth';
private tokenKey = 'apexgym_token';
    constructor(private http: HttpClient) { }

    login(loginData: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData);
  }

  register(registerData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerData);
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // NEW: Store token after successful login/register
  private storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // NEW: Logout method
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // NEW: Get stored token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}

export { RegisterRequest };


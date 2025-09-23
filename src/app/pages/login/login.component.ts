import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginRequest } from '../../models/auth.model';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginData: LoginRequest = {
    email: '',
    password: ''
  };

   isLoading = false;
  errorMessage = '';

    constructor(private authService: AuthService) { }

     onLogin(): void {
    // Reset error message
    this.errorMessage = '';
    
    // Show loading state
    this.isLoading = true;

    // Call authentication service
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        // Success handling
        this.isLoading = false;
        console.log('Login successful:', response);
        // TODO: Store token and redirect to dashboard
        this.authService.storeToken(response.token);
      },
      error: (error) => {
        // Error handling
        this.isLoading = false;
        this.errorMessage = 'Login failed. Please check your credentials.';
        console.error('Login error:', error);
      }
    });
  }

}

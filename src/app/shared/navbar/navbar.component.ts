import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- MUST import
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule], // <-- include CommonModule
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
    isLoggedIn = computed(() => this.authService.isLoggedInSignal());
  constructor(public authService: AuthService) {} // make it public to access in template

  logout() {
    this.authService.logout();
  }
}

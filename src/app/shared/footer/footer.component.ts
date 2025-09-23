import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-dark text-light text-center py-3 mt-5">
      <div class="container">
        <p>&copy; 2024 ApexGym Management System. All rights reserved.</p>
      </div>
    </footer>
  `
})
export class FooterComponent {}

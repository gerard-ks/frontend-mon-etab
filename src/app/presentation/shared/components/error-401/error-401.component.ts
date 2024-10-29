import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-error-401',
  standalone: true,
  imports: [ButtonModule, RouterModule],
  templateUrl: './error-401.component.html',
  styleUrl: './error-401.component.scss'
})
export class Error401Component {

  private router = inject(Router);

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  navigateToHome(): void {
    this.router.navigate(['/backoffice/dashboard']);
  }
}

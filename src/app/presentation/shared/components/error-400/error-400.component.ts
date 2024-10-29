import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-error-400',
  standalone: true,
  imports: [ButtonModule, RouterModule],
  templateUrl: './error-400.component.html',
  styleUrl: './error-400.component.scss'
})
export class Error400Component {

  private router = inject(Router);

  navigateToHome() {
    this.router.navigate(['/backoffice/dashboard']);
  }
}

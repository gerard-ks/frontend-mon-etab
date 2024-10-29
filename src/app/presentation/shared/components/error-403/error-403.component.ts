import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-error-403',
  standalone: true,
  imports: [RouterModule, ButtonModule],
  templateUrl: './error-403.component.html',
  styleUrl: './error-403.component.scss'
})
export class Error403Component {

  private router = inject(Router);

  navigateToHome(): void {
    this.router.navigate(['/backoffice/dashboard']);
  }
}

import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-error-404',
  standalone: true,
  imports: [RouterModule, ButtonModule],
  templateUrl: './error-404.component.html',
  styleUrl: './error-404.component.scss'
})
export class Error404Component {

  private router = inject(Router);

  navigateToHome(): void {
    this.router.navigate(['/backoffice/dashboard']);
  }
}

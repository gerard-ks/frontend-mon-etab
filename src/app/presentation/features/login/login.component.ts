import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../core/services/auth.service';
import { finalize, Observable, Subject, take, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthStatus } from '../../../domains/enums/auth.enum';
import { IUser } from '../../../domains/interfaces/auth.interface';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  isLoading = false;
  returnUrl!: string;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
  ) {
    // Récupération de l'URL de retour
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/backoffice';
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      pseudo: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    // Vérifier si l'utilisateur est déjà connecté
    this.authService.getAuthStatus()
      .pipe(
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe(status => {
        if (status === AuthStatus.AUTHENTICATED) {
          this.router.navigate([this.returnUrl]);
        }
      });

    
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const credentials = this.loginForm.value;
      
      console.log('Tentative de connexion avec:', credentials);

      this.authService.login(credentials)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => {
            this.isLoading = false;

          })
        )
        .subscribe({
          next: (user) => {
            console.log('Login réussi, utilisateur:', user);
            
            // Vérification de l'état d'authentification
            this.authService.getAuthStatus().subscribe(status => {
              console.log('Statut d\'authentification:', status);
            });

            // Vérification de l'utilisateur courant
            this.authService.getCurrentUser().subscribe(currentUser => {
              console.log('Utilisateur courant:', currentUser);
            });

            // Navigation
            this.router.navigate([this.returnUrl], { replaceUrl: true });
          },
          error: (error) => {
            console.error('Erreur de connexion:', error);
            this.loginForm.setErrors({ invalidCredentials: true });
            this.loginForm.get('password')?.reset();
          }
        });
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }
  
}

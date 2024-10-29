import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-smtp',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule
  ],
  templateUrl: './smtp.component.html',
  styleUrl: './smtp.component.scss'
})
export class SmtpComponent {

  smtpForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.smtpForm = this.fb.group({
      smtpServer: ['', [Validators.required]],
      smtpPort: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      smtpUsername: ['', [Validators.required]],
      smtpPassword: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.smtpForm.valid) {
      console.log(this.smtpForm.value);
      // Ici, vous ajouteriez la logique pour envoyer les données au serveur
      this.router.navigate(['/school']);
    }
  }
}

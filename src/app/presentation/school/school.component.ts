import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-school',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    FileUploadModule
  ],
  templateUrl: './school.component.html',
  styleUrl: './school.component.scss'
})
export class SchoolComponent {
   schoolForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}

   ngOnInit() {
    this.schoolForm = this.fb.group({
      schoolName: ['', [Validators.required]],
      schoolLogo: ['', [Validators.required]],
    });
  }


  onSubmit() {
    if (this.schoolForm.valid) {
      console.log(this.schoolForm.value);
      // Ici, vous ajouteriez la logique pour envoyer les données au serveur
    }
  }

  onFileSelected(event: any) {
    console.log(event);
  }
}

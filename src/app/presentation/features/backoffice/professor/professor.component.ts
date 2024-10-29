import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';


interface Professor {
    name: string;
    email: string;
    phone: string;
}


@Component({
  selector: 'app-professor',
  standalone: true,
  imports: [
        CommonModule,
        ReactiveFormsModule,
        TableModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        CardModule,
        IconFieldModule,
        InputIconModule
  ],
  templateUrl: './professor.component.html',
  styleUrl: './professor.component.scss'
})
export class ProfessorComponent {
  professors: Professor[] = [];
    visible: boolean = false;
    professorForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.professorForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required]
        });
    }

    ngOnInit() {
        // Exemple de données
        this.professors = [
            { name: 'John Smith', email: 'john.smith@example.com', phone: '123-456-7890' }
        ];
    }

    showDialog() {
        this.visible = true;
        this.professorForm.reset();
    }

    hideDialog() {
        this.visible = false;
        this.professorForm.reset();
    }

    saveProfessor() {
        if (this.professorForm.valid) {
            const newProfessor = this.professorForm.value;
            this.professors = [...this.professors, newProfessor];
            this.hideDialog();
        }
    }

    deleteProfessor(professor: Professor) {
        this.professors = this.professors.filter(p => p !== professor);
    }
}

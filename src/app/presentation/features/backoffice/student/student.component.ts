import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';


interface Student {
    name: string;
    email: string;
    phone: string;
}


@Component({
  selector: 'app-student',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule
  ],
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss'
})
export class StudentComponent {
  

    students: Student[] = [];
    visible: boolean = false;
    studentForm!: FormGroup;

    constructor(private fb: FormBuilder) {
        this.studentForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required]
        });
    }

    ngOnInit() {
        // Exemple de données
        this.students = [
            { name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' }
        ];
    }

    showDialog() {
        this.visible = true;
        this.studentForm.reset();
    }

    hideDialog() {
        this.visible = false;
        this.studentForm.reset();
    }

    saveStudent() {
        if (this.studentForm.valid) {
            const newStudent = this.studentForm.value;
            this.students = [...this.students, newStudent];
            this.hideDialog();
        }
    }

    deleteStudent(student: Student) {
        this.students = this.students.filter(s => s !== student);
    }

}

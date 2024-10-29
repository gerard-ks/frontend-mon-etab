import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

interface User {
    name: string;
    email: string;
    phone: string;
}

@Component({
  selector: 'app-user',
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
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
   users: User[] = [];
    visible: boolean = false;
    userForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.userForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required]
        });
    }

    ngOnInit() {
        // Exemple de données
        this.users = [
            { name: 'Admin User', email: 'admin@example.com', phone: '123-456-7890' }
        ];
    }

    showDialog() {
        this.visible = true;
        this.userForm.reset();
    }

    hideDialog() {
        this.visible = false;
        this.userForm.reset();
    }

    saveUser() {
        if (this.userForm.valid) {
            const newUser = this.userForm.value;
            this.users = [...this.users, newUser];
            this.hideDialog();
        }
    }

    deleteUser(user: User) {
        this.users = this.users.filter(u => u !== user);
    }
}

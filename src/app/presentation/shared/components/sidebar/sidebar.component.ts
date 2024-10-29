import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Sidebar, SidebarModule } from 'primeng/sidebar';
import { StyleClassModule } from 'primeng/styleclass';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../../../core/services/auth.service';
import { IUser } from '../../../../domains/interfaces/auth.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SidebarModule, ButtonModule, RippleModule, AvatarModule, StyleClassModule, CommonModule, RouterModule, TooltipModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

   
  currentUser$!: Observable<IUser | null>;
  sidebarVisible!: boolean;
  sidebarExpanded: boolean = true;
  defaultAvatar = 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png';


  private authService = inject(AuthService);

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  @Output() sidebarToggled = new EventEmitter<boolean>();

   menuItems = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/backoffice/dashboard' },
    { label: 'Écoles', icon: 'pi pi-building', route: '/backoffice/schools' },
    { label: 'Élèves', icon: 'pi pi-users', route: '/backoffice/students' },
    { label: 'Professeurs', icon: 'pi pi-users', route: '/backoffice/professors' },
    { label: 'Utilisateurs', icon: 'pi pi-user', route: '/backoffice/users' },
    { label: 'Rapport', icon: 'pi pi-file-export', route: '/backoffice/reports' },
  ];

  ngOnInit(): void {
    this.sidebarVisible = true;
    this.currentUser$ = this.authService.getCurrentUser();
  }

  closeCallback(e: any): void {
    this.sidebarRef.close(e);
  }

   toggleSidebar(): void {
    this.sidebarExpanded = !this.sidebarExpanded;
    this.sidebarToggled.emit(this.sidebarExpanded);
  }

  logout() {
    this.authService.logout();
  }

  handleAvatarError(event: any) {
    event.target.src = this.defaultAvatar;
  }
}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout-backoffice',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, CommonModule],
  templateUrl: './layout-backoffice.component.html',
  styleUrl: './layout-backoffice.component.scss'
})
export class LayoutBackofficeComponent {
  sidebarExpanded: boolean = true;

  onSidebarToggle(expanded: boolean) {
    this.sidebarExpanded = expanded;
  }
}

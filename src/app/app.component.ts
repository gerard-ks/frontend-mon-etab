import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LayoutConnexionComponent } from './presentation/layout-connexion/layout-connexion.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, InputTextModule, LayoutConnexionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend-mon-etab';
}

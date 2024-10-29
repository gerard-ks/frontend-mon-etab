import { Routes } from '@angular/router';
import { SmtpComponent } from './presentation/smtp/smtp.component';
import { SchoolComponent } from './presentation/school/school.component';

export const routes: Routes = [
    { path: 'smtp', component: SmtpComponent,  data: { title: 'Configuration SMTP' }  },
    { path: 'school', component: SchoolComponent,  data: { title: "Configuration de l'établissement" }  },
];

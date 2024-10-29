import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Roles } from './domains/enums/auth.enum';
import { LayoutConnexionComponent } from './presentation/layouts/layout-connexion/layout-connexion.component';
import { LayoutBackofficeComponent } from './presentation/layouts/layout-backoffice/layout-backoffice.component';
import { noAuthGuard } from './core/guards/noauth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Redirection par défaut
  {
    path: '',
    redirectTo: 'backoffice',
    pathMatch: 'full'
  },

  // Routes d'authentification
  {
    path: 'auth',
    component: LayoutConnexionComponent,
    canActivate: [noAuthGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./presentation/features/login/login.component')
          .then(m => m.LoginComponent),
        title: 'Connexion'
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },

  // Routes du backoffice
  {
    path: 'backoffice',
    component: LayoutBackofficeComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./presentation/features/backoffice/dashboard/dashboard.component')
          .then(m => m.DashboardComponent),
        canActivate: [roleGuard],
        data: {
          roles: [Roles.ADMIN, Roles.USER],
          title: 'Tableau de bord',
          animation: 'DashboardPage'
        }
      },
      {
        path: 'schools',
        loadComponent: () => import('./presentation/features/backoffice/school/school.component')
          .then(m => m.SchoolComponent),
        canActivate: [roleGuard],
        data: {
          roles: [Roles.ADMIN],
          title: 'Gestion des écoles',
          animation: 'SchoolsPage'
        }
      },
      {
        path: 'students',
        loadComponent: () => import('./presentation/features/backoffice/student/student.component')
          .then(m => m.StudentComponent),
        canActivate: [roleGuard],
        data: {
          roles: [Roles.ADMIN],
          title: 'Gestion des étudiants',
          animation: 'StudentsPage'
        }
      },
      {
        path: 'professors',
        loadComponent: () => import('./presentation/features/backoffice/professor/professor.component')
          .then(m => m.ProfessorComponent),
        canActivate: [roleGuard],
        data: {
          roles: [Roles.ADMIN],
          title: 'Gestion des professeurs',
          animation: 'ProfessorsPage'
        }
      },
      {
        path: 'users',
        loadComponent: () => import('./presentation/features/backoffice/user/user.component')
          .then(m => m.UserComponent),
        canActivate: [roleGuard],
        data: {
          roles: [Roles.ADMIN],
          title: 'Gestion des utilisateurs',
          animation: 'UsersPage'
        }
      },
      {
        path: 'reports',
            loadComponent: () => import('./presentation/features/backoffice/report/report.component')
          .then(m => m.ReportComponent),
        canActivate: [roleGuard],
        data: {
          roles: [Roles.ADMIN],
          title: 'Rapports',
          animation: 'ReportsPage'
        }
      }
    ]
  },

  // Routes d'erreur
  {
    path: 'error',
    children: [
      {
        path: '401',
        loadComponent: () => import('./presentation/shared/components/error-401/error-401.component')
          .then(m => m.Error401Component),
        title: 'Non autorisé'
      },
      {
        path: '403',
        loadComponent: () => import('./presentation/shared/components/error-403/error-403.component')
          .then(m => m.Error403Component),
        title: 'Accès refusé'
      },
      {
        path: '404',
        loadComponent: () => import('./presentation/shared/components/error-404/error-404.component')
          .then(m => m.Error404Component),
        title: 'Page non trouvée'
      },
      {
        path: '500',
        loadComponent: () => import('./presentation/shared/components/error-500/error-500.component')
          .then(m => m.Error500Component),
        title: 'Erreur serveur'
      }
    ]
  },

  // Fallback route
  {
    path: '**',
    redirectTo: 'error/404'
  }
];
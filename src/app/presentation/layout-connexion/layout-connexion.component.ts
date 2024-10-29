import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ImageModule } from 'primeng/image';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-layout-connexion',
  standalone: true,
  imports: [RouterOutlet, ImageModule],
  templateUrl: './layout-connexion.component.html',
  styleUrl: './layout-connexion.component.scss'
})
export class LayoutConnexionComponent implements OnInit, OnDestroy {
  currentTitle: string = '';
  private destroy$ = new Subject<void>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.setupTitleUpdates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupTitleUpdates(): void {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.extractRouteTitle()),
      takeUntil(this.destroy$)
    ).subscribe(title => {
      this.currentTitle = title || 'Formulaire';
    });
  }

  private extractRouteTitle(): string {
    let route = this.router.routerState.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.snapshot.data['title'];
  }
}

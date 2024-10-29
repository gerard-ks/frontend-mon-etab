import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet, ActivatedRoute } from '@angular/router';
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

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter(route => route.outlet === 'primary')
    ).subscribe((route) => {
      this.currentTitle = route.snapshot.data['title'] || '';
    });
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
      console.log('Nouveau titre:', title);
      this.currentTitle = title || 'Formulaire';
    });
  }

  private extractRouteTitle(): string {
    let route = this.router.routerState.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    console.log('Données de route:', route.snapshot.data);
    return route.snapshot.data['title'];
  }
}

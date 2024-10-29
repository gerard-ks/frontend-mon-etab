import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { filter, map, mergeMap, Subscription } from 'rxjs';
import { TitleService } from '../../../../core/services/title.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
   
   @Input() sidebarExpanded: boolean = true;
   pageTitle!: string;
   private routerSubscription!: Subscription;

   constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: TitleService
  ) {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      mergeMap(route => route.data)
    ).subscribe(data => {
      this.titleService.setTitle(data['title']);
      this.pageTitle = this.titleService.getTitle();
    });
  }

  ngOnInit(): void {
    // Subscribe to title changes
    this.titleService.pageTitle$.subscribe(title => {
      this.pageTitle = title;
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

}

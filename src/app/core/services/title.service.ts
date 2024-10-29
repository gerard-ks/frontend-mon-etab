import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private defaultTitle = 'Administration';
  private pageTitleSubject = new BehaviorSubject<string>(this.defaultTitle);
  pageTitle$ = this.pageTitleSubject.asObservable();

  constructor(private titleService: Title) {}

  setTitle(title: string | undefined) {
    const newTitle = title || this.defaultTitle;
    this.pageTitleSubject.next(newTitle);
    this.titleService.setTitle(`${newTitle} - ${this.defaultTitle}`);
  }

  getTitle(): string {
    return this.pageTitleSubject.value;
  }
}
import { LocalStorageService } from "ngx-webstorage";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class WebStorageService {

  private readonly localStorageService = inject(LocalStorageService);

  get(key: string): any {
    return this.localStorageService.retrieve(key);
  }

  set(key: string, value: any): void {
    this.localStorageService.store(key, value);
  }

  remove(key: string): void {
    this.localStorageService.clear(key);
  }

  clear(): void {
    this.localStorageService.clear();
  }

  watch(key: string): Observable<any> {
    return this.localStorageService.observe(key);
  }
}
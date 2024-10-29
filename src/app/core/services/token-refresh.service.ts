import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TokenRefreshState {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  setRefreshing(value: boolean): void {
    this.isRefreshing = value;
  }

  isCurrentlyRefreshing(): boolean {
    return this.isRefreshing;
  }

  getRefreshSubject(): BehaviorSubject<string | null> {
    return this.refreshTokenSubject;
  }
}
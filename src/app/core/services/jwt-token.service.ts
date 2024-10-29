import { inject, Injectable } from "@angular/core";
import { AUTH_CONSTANTS } from "../../domains/constants/auth.constants";
import { WebStorageService } from "./webstorage.service";

@Injectable({ providedIn: 'root' })
export class JWTTokenService  {

  private readonly storage = inject(WebStorageService);
  
  getToken(): string | null {
    return this.storage.get(AUTH_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN);
  }

  setToken(token: string): void {
    this.storage.set(AUTH_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  removeToken(): void {
    this.storage.remove(AUTH_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN);
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const expiration = this.storage.get(AUTH_CONSTANTS.STORAGE_KEYS.TOKEN_EXPIRATION);
      return expiration && new Date(expiration) > new Date();
    } catch {
      return false;
    }
  }
}
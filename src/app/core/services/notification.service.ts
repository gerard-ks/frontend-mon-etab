import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class NotificationService  {

  private readonly messageService = inject(MessageService);

  success(detail: string, summary: string = 'Succès'): void {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
      life: 3000
    });
  }

  error(detail: string, summary: string = 'Erreur'): void {
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life: 5000
    });
  }

  info(detail: string, summary: string = 'Information'): void {
    this.messageService.add({
      severity: 'info',
      summary,
      detail,
      life: 3000
    });
  }

  warn(detail: string, summary: string = 'Attention'): void {
    this.messageService.add({
      severity: 'warn',
      summary,
      detail,
      life: 4000
    });
  }

  clear(): void {
    this.messageService.clear();
  }
}
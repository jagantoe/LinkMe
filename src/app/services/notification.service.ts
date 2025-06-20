import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

export type NotificationType = 'success' | 'info' | 'warn' | 'error';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private readonly messageService = inject(MessageService);

    show(type: NotificationType, summary: string, detail: string): void {
        this.messageService.add({ severity: type, summary, detail });
    }

    showSuccess(detail: string, summary = 'Success'): void {
        this.show('success', summary, detail);
    }

    showError(detail: string, summary = 'Error'): void {
        this.show('error', summary, detail);
    }

    showInfo(detail: string, summary = 'Information'): void {
        this.show('info', summary, detail);
    }

    showWarning(detail: string, summary = 'Warning'): void {
        this.show('warn', summary, detail);
    }
}

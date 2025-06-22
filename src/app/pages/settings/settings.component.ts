import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { SettingsService } from '../../services/settings.service';

// PrimeNG Imports
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { TabsModule } from 'primeng/tabs';

// Component Imports
import { RouterLink } from '@angular/router';
import { AppearanceSettingsComponent } from '../../components/settings/appearance-settings/appearance-settings.component';
import { BehaviorSettingsComponent } from '../../components/settings/behavior-settings/behavior-settings.component';
import { ProjectManagementComponent } from '../../components/settings/project-management/project-management.component';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush, imports: [
        CommonModule,
        ButtonModule,
        CardModule,
        DividerModule,
        ConfirmDialogModule,
        TabsModule,
        AppearanceSettingsComponent,
        BehaviorSettingsComponent,
        ProjectManagementComponent,
        RouterLink
    ],
})
export class SettingsComponent {
    private readonly settingsService = inject(SettingsService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly notificationService = inject(NotificationService);

    resetSettings(): void {
        this.confirmationService.confirm({
            message: 'Are you sure you want to reset all settings to defaults?',
            header: 'Reset Settings',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.settingsService.resetSettings();
                this.notificationService.showSuccess('Settings have been reset to defaults');
            }
        });
    }
}

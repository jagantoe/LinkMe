import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppSettings } from '../../../models/settings.model';
import { SettingsService } from '../../../services/settings.service';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
    selector: 'app-behavior-settings',
    templateUrl: './behavior-settings.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormsModule,
        InputSwitchModule,
        CardModule
    ]
})
export class BehaviorSettingsComponent {
    private readonly settingsService = inject(SettingsService);

    readonly settings = this.settingsService.settings;

    updateSetting<K extends keyof AppSettings>(key: K, value: any): void {
        this.settingsService.updateSettings({ [key]: value } as any);
    }
}

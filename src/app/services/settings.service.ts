import { effect, Injectable, signal } from '@angular/core';
import { AppSettings, DEFAULT_SETTINGS } from '../models/settings.model';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private readonly SETTINGS_KEY = 'linkme_settings';
    private readonly settingsSignal = signal<AppSettings>(DEFAULT_SETTINGS);

    readonly settings = this.settingsSignal.asReadonly();

    constructor() {
        this.loadSettings();

        // Automatically save settings when they change
        effect(() => {
            const currentSettings = this.settings();
            localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(currentSettings));

            // Apply dark mode setting
            if (currentSettings.darkMode) {
                document.documentElement.classList.add('my-app-dark');
            } else {
                document.documentElement.classList.remove('my-app-dark');
            }
        });
    }

    private loadSettings(): void {
        const settingsJson = localStorage.getItem(this.SETTINGS_KEY);
        if (settingsJson) {
            try {
                const savedSettings: AppSettings = JSON.parse(settingsJson);
                // Merge with default settings to ensure all properties exist
                this.settingsSignal.set({ ...DEFAULT_SETTINGS, ...savedSettings });
            } catch (e) {
                console.error('Failed to parse settings from localStorage', e);
                this.settingsSignal.set(DEFAULT_SETTINGS);
            }
        }
    }

    updateSettings(settings: Partial<AppSettings>): void {
        this.settingsSignal.update(current => ({
            ...current,
            ...settings
        }));
    }

    resetSettings(): void {
        this.settingsSignal.set(DEFAULT_SETTINGS);
    }
}

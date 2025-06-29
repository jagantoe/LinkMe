export type AppPage = 'home' | 'settings';

export interface AppSettings {
    darkMode: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
    darkMode: false
};

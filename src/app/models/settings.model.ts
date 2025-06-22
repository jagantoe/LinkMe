export interface AppSettings {
    darkMode: boolean;
    defaultTagColor: string;
    autoCopyToClipboard: boolean;
    openLinksInNewTab: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
    darkMode: false,
    defaultTagColor: '#3B82F6', // Blue
    autoCopyToClipboard: false,
    openLinksInNewTab: true
};

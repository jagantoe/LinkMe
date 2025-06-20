export interface AppSettings {
    darkMode: boolean;
    defaultTagColor: string;
    listViewMode: 'compact' | 'detailed';
    autoCopyToClipboard: boolean;
    openLinksInNewTab: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
    darkMode: false,
    defaultTagColor: '#3B82F6', // Blue
    listViewMode: 'detailed',
    autoCopyToClipboard: false,
    openLinksInNewTab: true
};

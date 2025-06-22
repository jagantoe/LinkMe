import { Injectable, signal } from '@angular/core';
import { BaseProject, Project } from '../models/link.model';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    readonly projectDialogVisible = signal(false);
    readonly projectDialogData = signal<{
        title: string;
        project: Project | null;
        saveCallback: (project: BaseProject) => void;
    } | null>(null);

    openProjectDialog(title: string, project: Project | null, saveCallback: (project: BaseProject) => void): void {
        this.projectDialogData.set({
            title,
            project,
            saveCallback
        });
        this.projectDialogVisible.set(true);
    }

    closeProjectDialog(): void {
        this.projectDialogVisible.set(false);
    }
}

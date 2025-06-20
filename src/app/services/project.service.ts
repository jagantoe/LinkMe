import { Injectable, computed, inject } from '@angular/core';
import { Project } from '../models/link.model';
import { LinkStorageService } from './link-storage.service';
import { NotificationService } from './notification.service';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private readonly linkStorage = inject(LinkStorageService);
    private readonly notificationService = inject(NotificationService);

    readonly projects = this.linkStorage.projects;
    readonly currentProject = this.linkStorage.currentProject;
    readonly hasProjects = computed(() => this.projects().length > 0);

    createProject(name: string, description?: string): Project {
        const project = this.linkStorage.addProject(name.trim(), description?.trim());
        this.notificationService.showSuccess('Project has been created');
        return project;
    }

    updateProject(project: Project): void {
        this.linkStorage.updateProject(project);
        this.notificationService.showSuccess('Project has been updated');
    }

    deleteProject(projectId: string): void {
        this.linkStorage.deleteProject(projectId);
        this.notificationService.showSuccess('Project has been deleted');
    }

    setCurrentProject(project: Project): void {
        this.linkStorage.setCurrentProject(project);
    }

    formatDate(date: Date): string {
        return new Date(date).toLocaleDateString();
    }
}

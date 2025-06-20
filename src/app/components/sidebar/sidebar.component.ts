import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Project } from '../../models/link.model';
import { ProjectService } from '../../services/project.service';

// PrimeNG
import { ButtonModule } from 'primeng/button';

// Components
import { AddProjectDialogComponent } from './add-project-dialog/add-project-dialog.component';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, RouterLink, ButtonModule, AddProjectDialogComponent],
    providers: [ConfirmationService]
})
export class SidebarComponent {
    private readonly projectService = inject(ProjectService);
    private readonly confirmationService = inject(ConfirmationService);

    readonly projects = this.projectService.projects;
    readonly currentProject = this.projectService.currentProject;
    readonly addProjectDialogVisible = signal(false);

    showAddProjectDialog(): void {
        this.addProjectDialogVisible.set(true);
    }

    addProject(projectData: { name: string, description: string }): void {
        if (projectData.name.trim()) {
            this.projectService.createProject(
                projectData.name,
                projectData.description
            );
            this.addProjectDialogVisible.set(false);
        }
    }

    selectProject(project: Project): void {
        this.projectService.setCurrentProject(project);
    }

    deleteProject(event: Event, project: Project): void {
        event.stopPropagation();
        this.confirmationService.confirm({
            message: `Are you sure you want to delete the project "${project.name}"? This will permanently delete all links associated with this project.`,
            header: 'Delete Project',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.projectService.deleteProject(project.id);
            }
        });
    }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Project } from '../../../models/link.model';
import { ProjectService } from '../../../services/project.service';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { EditProjectDialogComponent } from '../edit-project-dialog/edit-project-dialog.component';

@Component({
    selector: 'app-project-management',
    templateUrl: './project-management.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush, imports: [
        CommonModule,
        ButtonModule,
        CardModule,
        TableModule,
        ConfirmDialogModule,
        EditProjectDialogComponent
    ],
})
export class ProjectManagementComponent {
    private readonly projectService = inject(ProjectService);
    private readonly confirmationService = inject(ConfirmationService);

    readonly projects = this.projectService.projects;

    // Dialog control
    readonly projectDialogVisible = signal(false);
    // Edit project state
    readonly selectedProject = signal<Project | null>(null);

    formatDate(date: Date): string {
        return this.projectService.formatDate(date);
    }

    handleEditProject(project: Project): void {
        this.selectedProject.set(project);
        this.projectDialogVisible.set(true);
    }

    handleDeleteProject(project: Project): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete the project "${project.name}"? This will permanently delete all links associated with this project.`,
            header: 'Delete Project',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.projectService.deleteProject(project.id);
            }
        });
    }

    saveProject(projectData: { name: string, description: string }): void {
        if (!this.selectedProject()) {
            return;
        }

        const updatedProject: Project = {
            ...this.selectedProject()!,
            name: projectData.name.trim(),
            description: projectData.description.trim() || undefined,
            updatedAt: new Date()
        };

        this.projectService.updateProject(updatedProject);
        this.projectDialogVisible.set(false);
    }
}

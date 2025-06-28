import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { BaseProject, Project } from '../../../models/link.model';
import { DialogService } from '../../../services/dialog.service';
import { ProjectService } from '../../../services/project.service';

@Component({
    selector: 'app-project-management',
    templateUrl: './project-management.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ButtonModule,
        TranslocoModule,
        CardModule,
        TableModule,
        ConfirmDialogModule
    ],
})
export class ProjectManagementComponent {
    private readonly projectService = inject(ProjectService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly dialogService = inject(DialogService);

    readonly projects = this.projectService.projects;

    formatDate(date: Date): string {
        return this.projectService.formatDate(date);
    }

    handleAddProject(): void {
        this.dialogService.openProjectDialog('project.form.addTitle', null, (projectData) => {
            this.saveProject(projectData);
        });
    }

    handleEditProject(project: Project): void {
        this.dialogService.openProjectDialog('project.form.editTitle', project, (projectData) => {
            this.saveEditedProject(project, projectData);
        });
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

    private saveProject(projectData: BaseProject): void {
        // Create new project
        this.projectService.createProject(
            projectData.name,
            projectData.description
        );
    }

    private saveEditedProject(originalProject: Project, projectData: BaseProject): void {
        // Edit existing project
        const updatedProject: Project = {
            ...originalProject,
            name: projectData.name,
            description: projectData.description,
            updatedAt: new Date()
        };

        this.projectService.updateProject(updatedProject);
    }
}

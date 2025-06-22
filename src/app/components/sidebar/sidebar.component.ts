import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BaseProject, Project } from '../../models/link.model';
import { DialogService } from '../../services/dialog.service';
import { ProjectService } from '../../services/project.service';

// PrimeNG
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, RouterLink, ButtonModule],
})
export class SidebarComponent {
    private readonly projectService = inject(ProjectService);
    private readonly dialogService = inject(DialogService);

    readonly projects = this.projectService.projects;
    readonly currentProject = this.projectService.currentProject;

    // Setup an output event to communicate with the parent component
    readonly closeSidebar = output<void>();

    showAddProjectDialog(): void {
        this.dialogService.openProjectDialog(
            'Add New Project',
            null,
            (projectData) => this.addProject(projectData)
        );
    }

    addProject(projectData: BaseProject): void {
        if (projectData.name.trim()) {
            this.projectService.createProject(
                projectData.name,
                projectData.description
            );
        }
    }

    selectProject(project: Project): void {
        this.projectService.setCurrentProject(project);
    }

    // Close sidebar on mobile when a project is selected
    onMobileProjectSelect(): void {
        this.closeSidebar.emit();
    }

    // Close sidebar on mobile when a menu item is clicked
    onMobileMenuClick(): void {
        this.closeSidebar.emit();
    }
}

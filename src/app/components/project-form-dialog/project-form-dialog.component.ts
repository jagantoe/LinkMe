import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { BaseProject } from '../../models/link.model';
import { DialogService } from '../../services/dialog.service';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-project-form-dialog',
    templateUrl: './project-form-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormsModule,
        DialogModule,
        InputTextModule,
        TextareaModule,
        TranslocoModule,
        ButtonModule
    ]
})
export class ProjectFormDialogComponent {
    private readonly dialogService = inject(DialogService);

    readonly visible = this.dialogService.projectDialogVisible;
    readonly dialogData = this.dialogService.projectDialogData;

    readonly dialogTitle = computed(() =>
        this.isEditMode()
            ? 'project.form.editTitle'
            : 'project.form.addTitle'
    );
    readonly isEditMode = computed(() => !!this.dialogData()?.project);

    // Form input signals - writable for two-way binding with ngModel
    readonly name: WritableSignal<string> = signal('');
    readonly description: WritableSignal<string> = signal('');
    readonly isFormValid = computed(() => this.name().trim().length > 0);

    constructor() {
        // Initialize form values from project data when it changes
        effect(() => {
            const data = this.dialogData();
            if (data?.project) {
                this.name.set(data.project.name);
                this.description.set(data.project.description || '');
            } else {
                // Reset form when in create mode
                this.name.set('');
                this.description.set('');
            }
        });
    }

    closeDialog(): void {
        this.dialogService.closeProjectDialog();
    }

    onSave(): void {
        if (this.isFormValid()) {
            const projectData: BaseProject = {
                name: this.name().trim(),
                description: this.description().trim() || undefined
            };

            const callback = this.dialogData()?.saveCallback;
            if (callback) {
                callback(projectData);
            }

            this.closeDialog();

            // Reset form in create mode after save
            if (!this.isEditMode()) {
                this.name.set('');
                this.description.set('');
            }
        }
    }
}

import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Project } from '../../../models/link.model';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-edit-project-dialog',
    templateUrl: './edit-project-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormsModule,
        DialogModule,
        InputTextModule,
        TextareaModule,
        ButtonModule
    ]
})
export class EditProjectDialogComponent {
    readonly visible = input<boolean>(false);
    readonly visibleChange = output<boolean>();
    readonly project = input<Project | null>(null);
    readonly save = output<{ name: string, description: string }>();

    readonly editedProject = signal<{ name: string, description: string }>({ name: '', description: '' });

    updateName(name: string): void {
        this.editedProject.update(p => ({ ...p, name }));
    }

    updateDescription(description: string): void {
        this.editedProject.update(p => ({ ...p, description }));
    }

    onSave(): void {
        if (this.editedProject().name.trim()) {
            this.save.emit(this.editedProject());
        }
    }

    onVisible(value: boolean): void {
        this.visibleChange.emit(value);

        // Reset form when dialog opens
        if (value && this.project()) {
            this.editedProject.set({
                name: this.project()!.name,
                description: this.project()!.description || ''
            });
        }
    }
}

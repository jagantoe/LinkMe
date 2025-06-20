import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-add-project-dialog',
    templateUrl: './add-project-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormsModule,
        DialogModule,
        InputTextModule,
        TextareaModule,
        ButtonModule
    ]
})
export class AddProjectDialogComponent {
    readonly visible = input<boolean>(false);
    readonly visibleChange = output<boolean>();
    readonly save = output<{ name: string, description: string }>();

    readonly projectData = signal<{ name: string, description: string }>({ name: '', description: '' });

    updateName(name: string): void {
        this.projectData.update(p => ({ ...p, name }));
    }

    updateDescription(description: string): void {
        this.projectData.update(p => ({ ...p, description }));
    }

    onSave(): void {
        if (this.projectData().name.trim()) {
            this.save.emit(this.projectData());
            this.projectData.set({ name: '', description: '' });
        }
    }

    onVisible(value: boolean): void {
        this.visibleChange.emit(value);

        // Reset form when dialog opens
        if (value) {
            this.projectData.set({ name: '', description: '' });
        }
    }
}

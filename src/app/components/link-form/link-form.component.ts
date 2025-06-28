import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { BaseLink, Link } from '../../models/link.model';
import { Tags } from '../../utils/tags.utils';

@Component({
    selector: 'app-link-form',
    templateUrl: './link-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, FormsModule, TranslocoModule]
})
export class LinkFormComponent {
    readonly formTitle = input.required<string>();
    readonly initialData = input<Link>();

    readonly isEditMode = computed(() => !!this.initialData());

    readonly linkId = computed(() => this.initialData()?.id ?? 'new-link');

    readonly formSubmit = output<BaseLink>();
    readonly formCancel = output<void>();

    // Form input signals - writable for two-way binding with ngModel
    readonly name: WritableSignal<string> = signal('');
    readonly url: WritableSignal<string> = signal('');
    readonly tags: WritableSignal<string> = signal('');
    readonly isFormValid = computed(() => this.name() && this.url());

    constructor() {
        // Initialize form values from initialData
        effect(() => {
            const data = this.initialData();
            if (data) {
                this.name.set(data.name);
                this.url.set(data.url);
                this.tags.set(Tags.format(data.tags));
            } else {
                this.name.set('');
                this.url.set('');
                this.tags.set('');
            }
        });
    }
    submitForm(): void {
        if (this.name() && this.url()) {
            const formData: BaseLink = {
                name: this.name(),
                url: this.url(),
                tags: Tags.parse(this.tags())
            };

            this.formSubmit.emit(formData);
        }
    }

    cancel(): void {
        this.formCancel.emit();
    }
}

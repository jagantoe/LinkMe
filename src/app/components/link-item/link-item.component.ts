import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { BaseLink, Link } from '../../models/link.model';
import { LinkStorageService } from '../../services/link-storage.service';
import { SettingsService } from '../../services/settings.service';
import { copyToClipboard } from '../../utils/clipboard.utils';
import { MatchType } from '../../utils/search.utils';
import { LinkFormComponent } from '../link-form/link-form.component';

@Component({
    selector: 'app-link-item',
    templateUrl: './link-item.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, LinkFormComponent]
})
export class LinkItemComponent {
    private readonly linkStorage = inject(LinkStorageService);
    private readonly settingsService = inject(SettingsService);
    readonly link = input.required<Link>();
    readonly score = input<number>(0);
    readonly matchType = input<MatchType>('name');
    readonly showMatchType = input<boolean>(false);
    readonly settings = this.settingsService.settings; readonly isEditing = signal(false);

    copyToClipboard(text: string, element: HTMLElement): void {
        copyToClipboard(text, element);
    }

    startEdit(): void {
        this.isEditing.set(true);
    }

    cancelEdit(): void {
        this.isEditing.set(false);
    }

    deleteLink(): void {
        this.linkStorage.deleteLink(this.link().id);
    }

    saveEditedLink(formData: BaseLink): void {
        const updatedLink: Link = {
            ...this.link(),
            name: formData.name,
            url: formData.url,
            tags: formData.tags
        };

        this.linkStorage.updateLink(updatedLink);
        this.isEditing.set(false);
    }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { Link } from '../../models/link.model';
import { AppSettings } from '../../models/settings.model';
import { LinkStorageService } from '../../services/link-storage.service';
import { SettingsService } from '../../services/settings.service';
import { copyToClipboard } from '../../utils/clipboard.utils';
import { Tags } from '../../utils/tags.utils';

@Component({
    selector: 'app-link-item',
    templateUrl: './link-item.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule]
})
export class LinkItemComponent {
    private readonly linkStorage = inject(LinkStorageService);
    private readonly settingsService = inject(SettingsService);

    readonly item = input.required<{ link: Link, score: number, matchType: string }>();
    readonly viewMode = input.required<AppSettings['listViewMode']>();
    readonly showMatchType = input<boolean>(false);
    readonly settings = this.settingsService.settings; readonly isEditing = signal(false);
    readonly onCopyToClipboard = output<{ text: string, element: HTMLElement }>();

    // Expose utility functions to the template
    readonly formatTags = Tags.format;

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
        this.linkStorage.deleteLink(this.item().link.id);
    } saveEditedLink(nameInput: HTMLInputElement, urlInput: HTMLInputElement, tagsInput: HTMLInputElement): void {
        if (nameInput.value && urlInput.value) {
            const tags = Tags.parse(tagsInput.value);

            const updatedLink: Link = {
                ...this.item().link,
                name: nameInput.value,
                url: urlInput.value,
                tags
            };

            this.linkStorage.updateLink(updatedLink);
            this.isEditing.set(false);
        }
    }
}

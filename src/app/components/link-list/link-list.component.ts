import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LinkStorageService } from '../../services/link-storage.service';
import { SearchService } from '../../services/search.service';
import { SettingsService } from '../../services/settings.service';
import { copyToClipboard } from '../../utils/clipboard.utils';
import { Tags } from '../../utils/tags.utils';
import { LinkItemComponent } from '../link-item/link-item.component';

@Component({
    selector: 'app-link-list',
    templateUrl: './link-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, FormsModule, LinkItemComponent]
})
export class LinkListComponent {
    private readonly linkStorage = inject(LinkStorageService);
    private readonly searchService = inject(SearchService);
    private readonly settingsService = inject(SettingsService);

    readonly currentProject = this.linkStorage.currentProject;
    readonly searchTerm = this.searchService.searchTerm;
    readonly settings = this.settingsService.settings;

    // Computed property to get filtered links based on search
    readonly filteredLinks = this.searchService.searchResults;    // Use all links when no search term is present
    readonly displayLinks = computed(() => {
        return this.searchTerm()
            ? this.filteredLinks()
            : this.linkStorage.links().map(link => ({ link, score: 1, matchType: 'name' as const }));
    });

    readonly isAddingLink = signal(false);

    toggleAddLink(): void {
        this.isAddingLink.update(value => !value);
    } addNewLink(name: string, url: string, tagsInput: string): void {
        if (name && url) {
            const tags = Tags.parse(tagsInput);
            this.linkStorage.addLink(name, url, tags);
            this.isAddingLink.set(false);
        }
    }

    copyToClipboard(text: string, element: HTMLElement): void {
        copyToClipboard(text, element);
    }

    clearSearch(): void {
        this.searchService.clearSearch();
    }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';
import { SettingsService } from '../../services/settings.service';

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, FormsModule]
})
export class SearchBarComponent {
    private readonly searchService = inject(SearchService);
    private readonly settingsService = inject(SettingsService);

    readonly searchTerm = this.searchService.searchTerm;
    readonly settings = this.settingsService.settings;

    updateSearch(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.searchService.setSearchTerm(input.value);
    }

    clearSearch(): void {
        this.searchService.clearSearch();
    }
}

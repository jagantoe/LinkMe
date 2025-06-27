import { Directive, HostListener, inject } from '@angular/core';
import { SearchService } from '../services/search.service';

@Directive({
    selector: 'input[appClearOnEscape]'
})
export class ClearOnEscapeDirective {
    private readonly searchService = inject(SearchService);

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            // Use the search service to clear the search
            this.searchService.clearSearch();
        }
    }
}

import { computed, inject, Injectable, signal } from '@angular/core';
import { Link } from '../models/link.model';
import { fuzzyMatch, MatchType } from '../utils/search.utils';
import { LinkStorageService } from './link-storage.service';

export interface SearchResult {
    link: Link;
    score: number;
    matchType: MatchType;
}

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private readonly linkStorage = inject(LinkStorageService);
    private readonly searchTermSignal = signal('');

    readonly searchTerm = this.searchTermSignal.asReadonly();

    readonly searchResults = computed(() => {
        const term = this.searchTerm().toLowerCase().trim();
        if (!term) return [];

        const links = this.linkStorage.links();
        const results: SearchResult[] = [];
        for (const link of links) {
            // Score links - higher is better
            let nameScore = fuzzyMatch(term, link.name.toLowerCase());
            let tagScore = 0;
            let hasTagMatch = false;

            // Check tags with lower priority
            for (const tag of link.tags) {
                const tagMatchScore = fuzzyMatch(term, tag.toLowerCase());
                if (tagMatchScore > 0) {
                    hasTagMatch = true;
                    tagScore = Math.max(tagScore, tagMatchScore * 0.7); // Lower priority for tag matches
                }
            }

            // Determine match type
            let matchType: MatchType = 'name';
            if (nameScore > 0 && hasTagMatch) {
                matchType = 'both';
            } else if (nameScore === 0 && hasTagMatch) {
                matchType = 'tag';
                nameScore = tagScore; // Use tag score if no name match
            } else if (nameScore === 0) {
                continue; // No match at all
            }

            results.push({
                link,
                score: nameScore,
                matchType
            });
        }

        // Sort by score (descending)
        return results.sort((a, b) => b.score - a.score);
    });

    setSearchTerm(term: string): void {
        this.searchTermSignal.set(term);
    }

    clearSearch(): void {
        this.searchTermSignal.set('');
    }
}

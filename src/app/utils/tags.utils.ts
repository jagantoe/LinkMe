/**
 * Utility functions for working with tags
 */
export const Tags = {
    /**
     * Parses a comma-separated string into an array of tags
     * @param tagsString Comma-separated tag string
     * @returns Array of trimmed, non-empty tags
     */
    parse(tagsString: string): string[] {
        return tagsString
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
    },

    /**
     * Formats an array of tags into a comma-separated string
     * @param tags Array of tags
     * @returns Comma-separated string of tags
     */
    format(tags: string[]): string {
        return tags.join(', ');
    }
};

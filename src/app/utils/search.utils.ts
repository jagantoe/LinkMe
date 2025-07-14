/**
 * Represents the type of match for search results.
 * - 'name': Match found in the link name
 * - 'tag': Match found in the link tags
 * - 'both': Match found in both name and tags
 */
export type MatchType = 'name' | 'tag' | 'both';


/**
 * Calculates the Levenshtein distance between two strings
 * @param a First string
 * @param b Second string
 * @returns The Levenshtein distance
 */
function levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];

    // Initialize matrix
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            const cost = a[j - 1] === b[i - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1, // deletion
                matrix[i][j - 1] + 1, // insertion
                matrix[i - 1][j - 1] + cost // substitution
            );
        }
    }

    return matrix[b.length][a.length];
}

/**
 * Performs a fuzzy match between a query and a target string
 * @param query The search term
 * @param target The string to search in
 * @returns A score between 0 and 1, where 1 is a perfect match and 0 is no match
 */
export function fuzzyMatch(query: string, target: string): number {
    if (target.includes(query)) {
        return 1.0; // Perfect match if query is substring
    }

    const distance = levenshteinDistance(query, target);
    const maxLength = Math.max(query.length, target.length);

    // Normalize distance to 0-1 range and invert (higher is better)
    const similarity = 1 - (distance / maxLength);

    // Return 0 if similarity is below threshold
    return similarity > 0.6 ? similarity : 0;
}

/**
 * Performs a multi-word fuzzy match between a query and a target string
 * The query is split by spaces and each word is matched separately
 * @param query The multi-word search term
 * @param target The string to search in
 * @returns A score between 0 and 1, where 1 is a perfect match and 0 is no match
 */
export function multiWordFuzzyMatch(query: string, target: string): number {
    // If query is empty or target is empty, return 0
    if (!query.trim() || !target.trim()) {
        return 0;
    }

    // If the exact query is found in the target, return 1 (perfect match)
    if (target.includes(query)) {
        return 1.0;
    }

    // Split the query into words
    const words = query.toLowerCase().split(/\s+/).filter(word => word.length > 0);

    // If no valid words, return 0
    if (words.length === 0) {
        return 0;
    }

    // Match each word and calculate the average score
    let totalScore = 0;
    let matchedWords = 0;

    for (const word of words) {
        const score = fuzzyMatch(word, target.toLowerCase());
        if (score > 0) {
            totalScore += score;
            matchedWords++;
        }
    }

    // If no words matched, return 0
    if (matchedWords === 0) {
        return 0;
    }

    // Calculate average score weighted by the number of matched words
    // This rewards matching more words from the query
    const avgScore = totalScore / words.length;
    const matchRatio = matchedWords / words.length;

    // Boost score based on the proportion of words that matched
    return avgScore * (0.5 + 0.5 * matchRatio);
}

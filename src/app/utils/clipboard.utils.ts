/**
 * Copies text to clipboard and shows feedback on the specified element
 * @param text Text to copy to clipboard
 * @param element HTML Element to show feedback on
 * @param feedbackText Text to show as feedback (default: "Copied!")
 * @param duration Duration in ms to show feedback (default: 1500ms)
 */
export function copyToClipboard(text: string, element: HTMLElement, feedbackText = 'Copied!', duration = 1500): void {
    navigator.clipboard.writeText(text);
    const originalText = element.textContent;
    element.textContent = feedbackText;
    setTimeout(() => {
        element.textContent = originalText;
    }, duration);
}

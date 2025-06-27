import { Directive, ElementRef, HostListener, inject } from '@angular/core';

/**
 * Directive that focuses an element when Ctrl+K is pressed globally.
 * This is a common keyboard shortcut for search in modern web applications.
 */
@Directive({
    selector: 'input[appKeyboardFocus]',
    standalone: true,
})
export class KeyboardFocusDirective {
    private readonly elementRef = inject(ElementRef);

    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        // Check if Ctrl+K is pressed and the user is not currently in an input or textarea
        if (
            event.key === 'k' &&
            (event.ctrlKey || event.metaKey)
        ) {
            // Prevent the default browser behavior (like opening bookmarks in some browsers)
            event.preventDefault();
            // Focus the element
            this.elementRef.nativeElement.focus();
        }
    }
}

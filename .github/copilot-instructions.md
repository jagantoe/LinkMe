## TypeScript Best Practices
- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices
- Don't use explicit `standalone: true` (it is implied by default)
- Use signals for state management
- Use `NgOptimizedImage` for all static images.

## Components
- Use `input()` and `output()` functions instead of decorators
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Always use seperate files for templates for components
- Prefer Template-driven forms instead of Reactive ones
- Do NOT use `ngClass`, use `class` bindings instead
- DO NOT use `ngStyle`, use `style` bindings instead
- When using `inject()` make the property private and readonly
- All Signals should be readonly

## State Management
- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable

## Templates
- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- When using angular components use the self closing tags instead of the opening and closing tags

## Services
- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

# Components
- Use components from the NgPrime library for UI elements

# Errors
- If you ever get stuck don't create a new file, instead ask for help.

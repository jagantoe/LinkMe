import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LinkListComponent } from '../link-list/link-list.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SearchBarComponent, LinkListComponent]
})
export class HomeComponent {
    // Home component logic can be added here if needed
}

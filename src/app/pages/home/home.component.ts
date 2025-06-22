import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LinkListComponent } from '../../components/link-list/link-list.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SearchBarComponent, LinkListComponent]
})
export class HomeComponent {
}

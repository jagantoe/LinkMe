import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ProjectFormDialogComponent } from './components/project-form-dialog/project-form-dialog.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    ToastModule,
    ConfirmDialogModule,
    ProjectFormDialogComponent
  ],
  providers: [ConfirmationService],
  templateUrl: './app.component.html'
})
export class App {
  protected title = 'LinkMe';

  // Sidebar state signal
  readonly sidebarVisible = signal(false);

  // Toggle sidebar visibility
  toggleSidebar(): void {
    this.sidebarVisible.update(current => !current);
  }
}

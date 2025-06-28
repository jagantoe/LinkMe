import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
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
    ProjectFormDialogComponent,
    TranslocoModule
  ],
  providers: [ConfirmationService],
  templateUrl: './app.component.html'
})
export class App {
  // Sidebar state signal
  readonly sidebarVisible = signal(false);

  // Toggle sidebar visibility
  toggleSidebar(): void {
    this.sidebarVisible.update(current => !current);
  }
}

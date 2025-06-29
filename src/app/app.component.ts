import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ProjectFormDialogComponent } from './components/project-form-dialog/project-form-dialog.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HomeComponent } from './pages/home/home.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    SidebarComponent,
    ToastModule,
    ConfirmDialogModule,
    ProjectFormDialogComponent,
    TranslocoModule,
    HomeComponent,
    SettingsComponent
  ],
  providers: [ConfirmationService],
  templateUrl: './app.component.html'
})
export class App {
  private readonly settingsService = inject(SettingsService);

  // Sidebar state signal
  readonly sidebarVisible = signal(false);

  // Page navigation from settings service
  readonly currentPage = this.settingsService.currentPage;

  // Toggle sidebar visibility
  toggleSidebar(): void {
    this.sidebarVisible.update(current => !current);
  }

  // Toggle between home and settings view
  toggleSettings(): void {
    const nextPage = this.currentPage() === 'settings' ? 'home' : 'settings';
    this.settingsService.navigateTo(nextPage);
  }
}

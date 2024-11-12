import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, SidebarComponent],
  template: `
    <div class="flex h-screen bg-gray-100">
      <app-sidebar />
      <main class="flex-1 overflow-x-hidden overflow-y-auto ml-16">
        <router-outlet />
      </main>
    </div>
  `
})
export class AppComponent {}
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
         (click)="close.emit()">
      <div class="relative top-20 mx-auto p-5 w-full max-w-2xl"
           (click)="$event.stopPropagation()">
        <div class="relative bg-white rounded-lg shadow-lg">
          <div class="flex items-center justify-between p-4 border-b">
            <h3 class="text-xl font-semibold text-gray-900">
              {{ title }}
            </h3>
            <button type="button" 
                    class="text-gray-400 hover:text-gray-500"
                    (click)="close.emit()">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-6">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ModalComponent {
  @Input() title = '';
  @Output() close = new EventEmitter<void>();
}
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-between px-4 py-3 border-t">
      <div class="flex items-center">
        <p class="text-sm text-gray-700">
          Showing
          <span class="font-medium">{{ startIndex + 1 }}</span>
          to
          <span class="font-medium">{{ endIndex }}</span>
          of
          <span class="font-medium">{{ totalItems }}</span>
          results
        </p>
      </div>
      <div class="flex items-center space-x-2">
        <button
          class="px-3 py-1 rounded border"
          [class.opacity-50]="currentPage === 1"
          [disabled]="currentPage === 1"
          (click)="pageChange.emit(currentPage - 1)">
          Previous
        </button>
        <button
          class="px-3 py-1 rounded border"
          [class.opacity-50]="currentPage === totalPages"
          [disabled]="currentPage === totalPages"
          (click)="pageChange.emit(currentPage + 1)">
          Next
        </button>
      </div>
    </div>
  `
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() pageSize = 10;
  @Input() totalItems = 0;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    const end = this.startIndex + this.pageSize;
    return end > this.totalItems ? this.totalItems : end;
  }
}
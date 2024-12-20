import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VariableService } from '../../services/variable.service';
import { TemplateVariable } from '../../models/template.model';
import { VariableEditorComponent } from '../../components/variable-editor/variable-editor.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-variables',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VariableEditorComponent,
    ModalComponent,
    PaginationComponent,
  ],
  templateUrl: './variables.component.html',
  styleUrl: './variables.component.scss',
})
export class VariablesComponent implements OnInit {
  variables$ = this.variableService.variables$;
  selectedVariable: TemplateVariable | null = null;
  showModal = false;
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;

  constructor(private readonly variableService: VariableService) {}

  ngOnInit() {
    this.variableService.loadVariables();
  }

  createVariable() {
    this.selectedVariable = {
      id: crypto.randomUUID(),
      name: '',
      path: '',
      type: 'string',
      defaultValue: '',
      description: '',
      required: true,
    };
    this.showModal = true;
  }

  editVariable(variable: TemplateVariable) {
    this.selectedVariable = { ...variable };
    this.showModal = true;
  }

  saveVariable(variable: TemplateVariable) {
    if (this.variableService.getVariableById(variable.id)) {
      this.variableService.updateVariable(variable);
    } else {
      this.variableService.addVariable(variable);
    }
    this.closeModal();
  }

  deleteVariable(id: string) {
    if (confirm('Are you sure you want to delete this variable?')) {
      this.variableService.deleteVariable(id);
      if (this.selectedVariable?.id === id) {
        this.closeModal();
      }
    }
  }

  closeModal() {
    this.showModal = false;
    this.selectedVariable = null;
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  filterVariables(variables: TemplateVariable[]): TemplateVariable[] {
    if (!this.searchTerm) return variables;

    const term = this.searchTerm.toLowerCase();
    return variables.filter(
      (variable) =>
        variable.name.toLowerCase().includes(term) ||
        variable.path.toLowerCase().includes(term) ||
        variable.description?.toLowerCase().includes(term)
    );
  }

  getPaginatedVariables(variables: TemplateVariable[]): TemplateVariable[] {
    const filtered = this.filterVariables(variables);
    const start = (this.currentPage - 1) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  }
}

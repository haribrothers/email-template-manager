import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VariableService } from '../../services/variable.service';
import { TemplateVariable } from '../../models/template.model';
import { VariableEditorComponent } from '../../components/variable-editor/variable-editor.component';
import { VariableListComponent } from '../../components/variable-list/variable-list.component';

@Component({
  selector: 'app-variables',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VariableEditorComponent,
    VariableListComponent
  ],
  templateUrl: './variables.component.html',
  styleUrl: './variables.component.scss'
})
export class VariablesComponent implements OnInit {
  variables$ = this.variableService.variables$;
  selectedVariable: TemplateVariable | null = null;

  constructor(private readonly variableService: VariableService) {}

  ngOnInit() {
    this.variableService.loadVariables();
  }

  createVariable() {
    this.selectedVariable = {
      id: crypto.randomUUID(),
      name: '',
      type: 'string',
      defaultValue: '',
      description: '',
      required: true
    };
  }

  selectVariable(variable: TemplateVariable) {
    this.selectedVariable = { ...variable };
  }

  saveVariable(variable: TemplateVariable) {
    if (this.variableService.getVariableById(variable.id)) {
      this.variableService.updateVariable(variable);
    } else {
      this.variableService.addVariable(variable);
    }
    this.selectedVariable = null;
  }

  deleteVariable(id: string) {
    if (confirm('Are you sure you want to delete this variable?')) {
      this.variableService.deleteVariable(id);
      if (this.selectedVariable?.id === id) {
        this.selectedVariable = null;
      }
    }
  }

  cancelEdit() {
    this.selectedVariable = null;
  }
}
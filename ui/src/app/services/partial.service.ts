import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TemplatePartial } from '../models/template.model';

@Injectable({
  providedIn: 'root'
})
export class PartialService {
  private partials = new BehaviorSubject<TemplatePartial[]>([]);
  partials$ = this.partials.asObservable();

  constructor() {
    this.loadPartials();
  }

  private loadPartials() {
    const saved = localStorage.getItem('templatePartials');
    if (saved) {
      this.partials.next(JSON.parse(saved));
    }
  }

  private saveToStorage(partials: TemplatePartial[]) {
    localStorage.setItem('templatePartials', JSON.stringify(partials));
  }

  getPartials() {
    return this.partials.getValue();
  }

  addPartial(partial: TemplatePartial) {
    const current = this.partials.getValue();
    const updated = [...current, partial];
    this.partials.next(updated);
    this.saveToStorage(updated);
  }

  updatePartial(partial: TemplatePartial) {
    const current = this.partials.getValue();
    const updated = current.map(p => p.id === partial.id ? partial : p);
    this.partials.next(updated);
    this.saveToStorage(updated);
  }

  deletePartial(id: string) {
    const current = this.partials.getValue();
    const updated = current.filter(p => p.id !== id);
    this.partials.next(updated);
    this.saveToStorage(updated);
  }
}
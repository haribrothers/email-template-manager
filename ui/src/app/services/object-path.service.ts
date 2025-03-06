import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ObjectPathService {
  /**
   * Converts flat object with dot notation keys to nested object
   * Example: { "user.name": "John", "user.email": "john@gmail.com" }
   * Becomes: { user: { name: "John", email: "john@gmail.com" } }
   */
  convertToNestedObject(flatObject: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};

    for (const [key, value] of Object.entries(flatObject)) {
      this.setNestedValue(result, key, value);
    }

    return result;
  }

  private setNestedValue(obj: Record<string, any>, path: string, value: any): void {
    const parts = path.split('.');
    let current = obj;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current)) {
        current[part] = {};
      }
      current = current[part];
    }

    current[parts[parts.length - 1]] = value;
  }

  /**
   * Checks if a string represents a nested path
   */
  isNestedPath(path: string): boolean {
    return path.includes('.');
  }

  /**
   * Gets the root object name from a nested path
   * Example: "user.name" returns "user"
   */
  getRootObject(path: string): string {
    return path.split('.')[0];
  }
}
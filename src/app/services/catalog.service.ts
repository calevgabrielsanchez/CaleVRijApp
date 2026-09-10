import { Injectable, signal } from '@angular/core';
import { CaleItem, DEFAULT_ITEMS, ItemStatus } from '../models/cale-item.model';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly storageKey = 'calevradmin.catalog.v1';
  private readonly itemState = signal<CaleItem[]>(this.readItems());

  readonly items = this.itemState.asReadonly();

  updateContent(id: string, content: string): void {
    this.itemState.update((items) => {
      const next = items.map((item) => item.id === id
        ? { ...item, content, updatedAt: new Date().toISOString() }
        : item);
      this.persist(next);
      return next;
    });
  }

  updateStatus(id: string, status: ItemStatus): void {
    this.itemState.update((items) => {
      const next = items.map((item) => item.id === id ? { ...item, status } : item);
      this.persist(next);
      return next;
    });
  }

  reset(): void {
    const next = DEFAULT_ITEMS.map((item) => ({ ...item }));
    this.itemState.set(next);
    this.persist(next);
  }

  downloadCsv(): void {
    const header = ['id', 'titulo', 'slug', 'tipo', 'estado', 'contenido', 'actualizado'];
    const rows = this.items().map((item) => [
      item.id,
      item.title,
      item.slug,
      item.type,
      item.status,
      item.content,
      item.updatedAt
    ]);
    const csv = [header, ...rows].map((row) => row.map((value) => this.csvCell(value)).join(',')).join('\r\n');
    const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `calevr-items-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  private csvCell(value: string): string {
    // Neutralize spreadsheet formulas before quoting the value.
    const safeValue = /^[=+\-@]/.test(value.trimStart()) ? `'${value}` : value;
    return `"${safeValue.replaceAll('"', '""')}"`;
  }

  private readItems(): CaleItem[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return DEFAULT_ITEMS.map((item) => ({ ...item }));
      const parsed: unknown = JSON.parse(stored);
      if (!Array.isArray(parsed) || !parsed.every((item) => this.isCaleItem(item))) {
        return DEFAULT_ITEMS.map((item) => ({ ...item }));
      }
      return parsed;
    } catch {
      return DEFAULT_ITEMS.map((item) => ({ ...item }));
    }
  }

  private isCaleItem(value: unknown): value is CaleItem {
    if (!value || typeof value !== 'object') return false;
    const item = value as Partial<CaleItem>;
    return typeof item.id === 'string'
      && typeof item.title === 'string'
      && typeof item.slug === 'string'
      && typeof item.type === 'string'
      && (item.status === 'published' || item.status === 'draft' || item.status === 'archived')
      && typeof item.content === 'string'
      && typeof item.updatedAt === 'string';
  }

  private persist(items: CaleItem[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch {
      // Storage can be unavailable in private browsing; the signal remains usable.
    }
  }
}

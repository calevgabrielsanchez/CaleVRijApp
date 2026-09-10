import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronRight, faCircle } from '@fortawesome/free-solid-svg-icons';
import { CaleItem, ItemStatus } from '../../models/cale-item.model';
import { CatalogService } from '../../services/catalog.service';
import { TextPlusComponent } from '../text-plus/text-plus.component';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [DecimalPipe, FontAwesomeModule, TextPlusComponent],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsComponent {
  private readonly catalog = inject(CatalogService);
  readonly items = this.catalog.items;
  readonly selectedId = signal(this.items()[0]?.id ?? '');
  readonly selectedItem = computed(() => this.items().find((item) => item.id === this.selectedId()));
  readonly savedMessage = signal('');
  readonly faChevronRight = faChevronRight;
  readonly faCircle = faCircle;

  select(item: CaleItem): void {
    this.selectedId.set(item.id);
    this.savedMessage.set('');
  }

  saveContent(content: string): void {
    const item = this.selectedItem();
    if (!item) return;
    this.catalog.updateContent(item.id, content);
    this.savedMessage.set('Cambios guardados');
  }

  cycleStatus(item: CaleItem): void {
    const next: Record<ItemStatus, ItemStatus> = {
      published: 'draft',
      draft: 'archived',
      archived: 'published'
    };
    this.catalog.updateStatus(item.id, next[item.status]);
  }
}

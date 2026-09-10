import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowTrendUp, faBoxArchive, faCircleCheck, faFileLines } from '@fortawesome/free-solid-svg-icons';
import { CatalogService } from '../../services/catalog.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private readonly catalog = inject(CatalogService);
  readonly items = this.catalog.items;
  readonly published = computed(() => this.items().filter((item) => item.status === 'published').length);
  readonly drafts = computed(() => this.items().filter((item) => item.status === 'draft').length);
  readonly archived = computed(() => this.items().filter((item) => item.status === 'archived').length);
  readonly faArrowTrendUp = faArrowTrendUp;
  readonly faBoxArchive = faBoxArchive;
  readonly faCircleCheck = faCircleCheck;
  readonly faFileLines = faFileLines;
}

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDownload, faFileCsv, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { CatalogService } from '../../services/catalog.service';

@Component({
  selector: 'app-export',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './export.component.html',
  styleUrl: './export.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExportComponent {
  private readonly catalog = inject(CatalogService);
  readonly items = this.catalog.items;
  readonly downloaded = signal(false);
  readonly faDownload = faDownload;
  readonly faFileCsv = faFileCsv;
  readonly faShieldHalved = faShieldHalved;

  download(): void {
    this.catalog.downloadCsv();
    this.downloaded.set(true);
  }
}

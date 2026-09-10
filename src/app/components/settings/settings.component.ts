import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowsRotate, faDatabase, faGear, faMobileScreenButton } from '@fortawesome/free-solid-svg-icons';
import { CatalogService } from '../../services/catalog.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
  private readonly catalog = inject(CatalogService);
  readonly resetDone = signal(false);
  readonly faArrowsRotate = faArrowsRotate;
  readonly faDatabase = faDatabase;
  readonly faGear = faGear;
  readonly faMobileScreenButton = faMobileScreenButton;

  resetData(): void {
    this.catalog.reset();
    this.resetDone.set(true);
  }
}

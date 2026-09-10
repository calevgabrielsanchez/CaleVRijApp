import { ChangeDetectionStrategy, Component, Type, computed, signal } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faAddressCard, faCalendarDays, faCube, faGamepad, faMusic, faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { ArViewerComponent } from './components/ar-viewer/ar-viewer.component';
import { ContactComponent } from './components/contact/contact.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExportComponent } from './components/export/export.component';
import { ItemsComponent } from './components/items/items.component';
import { SettingsComponent } from './components/settings/settings.component';

type SectionKey = 'calevr' | 'music' | 'social' | 'agenda' | 'contact';

interface MainSection {
  key: SectionKey;
  label: string;
  icon: IconDefinition;
  component: Type<unknown>;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ArViewerComponent, NgComponentOutlet, FontAwesomeModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  readonly activeSection = signal<SectionKey>('calevr');
  readonly arOpen = signal(false);
  readonly sections: readonly MainSection[] = [
    { key: 'calevr', label: 'CaleVRijeZ', icon: faGamepad, component: DashboardComponent },
    { key: 'music', label: 'Music', icon: faMusic, component: ItemsComponent },
    { key: 'social', label: 'Redes', icon: faShareNodes, component: ExportComponent },
    { key: 'agenda', label: 'Agenda', icon: faCalendarDays, component: SettingsComponent },
    { key: 'contact', label: 'Contacto', icon: faAddressCard, component: ContactComponent }
  ];
  readonly activeComponent = computed(() => this.sections.find((section) => section.key === this.activeSection())?.component ?? DashboardComponent);
  readonly faCube = faCube;

  navigate(section: SectionKey): void {
    this.activeSection.set(section);
  }

  openAr(): void {
    this.arOpen.set(true);
  }
}

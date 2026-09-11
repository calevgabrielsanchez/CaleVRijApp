import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { faForwardStep, faMusic } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
  readonly selectedAlbum = signal(2);
  readonly playing = signal(false);
  readonly albums = [
    { title: 'CaleVRijeZ', subtitle: 'Experiencias inmersivas', color: '#ffe55b' },
    { title: 'Laboratorio VR', subtitle: 'Sonidos del futuro', color: '#ffe55b' },
    { title: 'Guía de seguridad', subtitle: 'Documentos y audio', color: '#ffe55b' },
    { title: 'Sobre CaleVR', subtitle: 'Historias de la comunidad', color: '#ffe55b' }
  ];
  readonly faForwardStep = faForwardStep;
  readonly faMusic = faMusic;
  readonly faSpotify = faSpotify;

  selectAlbum(index: number): void {
    this.selectedAlbum.set(index);
    this.playing.set(false);
  }

  previous(): void {
    this.selectedAlbum.update((index) => (index - 1 + this.albums.length) % this.albums.length);
  }

  next(): void {
    this.selectedAlbum.update((index) => (index + 1) % this.albums.length);
  }
}

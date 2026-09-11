import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faTiktok, faYoutube } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-export',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './export.component.html',
  styleUrl: './export.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExportComponent {
  readonly slide = signal(0);
  readonly slides = [
    { image: 'https://picsum.photos/id/1015/800/500', title: 'Explora nuevos mundos' },
    { image: 'https://picsum.photos/id/1036/800/500', title: 'Experiencias que conectan' },
    { image: 'https://picsum.photos/id/1040/800/500', title: 'Tu próxima aventura' }
  ];
  readonly faChevronLeft = faChevronLeft;
  readonly faChevronRight = faChevronRight;
  readonly faFacebook = faFacebook;
  readonly faInstagram = faInstagram;
  readonly faTiktok = faTiktok;
  readonly faYoutube = faYoutube;

  previous(): void {
    this.slide.update((index) => (index - 1 + this.slides.length) % this.slides.length);
  }

  next(): void {
    this.slide.update((index) => (index + 1) % this.slides.length);
  }
}

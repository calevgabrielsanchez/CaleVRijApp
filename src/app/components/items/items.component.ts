import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CurrencyPipe, FontAwesomeModule],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsComponent {
  readonly faShoppingCart = faShoppingCart;
  readonly selectedCategory = signal('Todos');
  readonly products = [
    { name: 'CaleVRijeZ Starter Kit', price: 29.99, image: 'https://picsum.photos/id/180/600/450' },
    { name: 'Visor VR Explorer', price: 89.99, image: 'https://picsum.photos/id/96/600/450' },
    { name: 'Control Motion Pro', price: 49.99, image: 'https://picsum.photos/id/367/600/450' },
    { name: 'Lámpara Neon CaleVR', price: 34.5, image: 'https://picsum.photos/id/201/600/450' },
    { name: 'Camiseta CaleVRije', price: 19.99, image: 'https://picsum.photos/id/823/600/450' },
    { name: 'Pack Stickers VR', price: 8.99, image: 'https://picsum.photos/id/24/600/450' },
    { name: 'Soporte para Visor', price: 24.99, image: 'https://picsum.photos/id/436/600/450' },
    { name: 'Experiencia Digital VR', price: 59.99, image: 'https://picsum.photos/id/1040/600/450' }
  ];

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  buy(product: { name: string }): void {
    window.location.href = `mailto:contacto@calevrije.com?subject=${encodeURIComponent(`Comprar ${product.name}`)}`;
  }
}

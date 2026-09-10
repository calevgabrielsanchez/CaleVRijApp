import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faPen } from '@fortawesome/free-solid-svg-icons';
import { CaleItem } from '../../models/cale-item.model';

@Component({
  selector: 'app-text-plus',
  standalone: true,
  imports: [FormsModule, FontAwesomeModule],
  templateUrl: './text-plus.component.html',
  styleUrl: './text-plus.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextPlusComponent {
  readonly item = input.required<CaleItem>();
  readonly saved = output<string>();
  readonly draft = signal('');
  readonly faPen = faPen;
  readonly faCheck = faCheck;

  constructor() {
    effect(() => this.draft.set(this.item().content));
  }

  save(): void {
    this.saved.emit(this.draft().trim());
  }
}

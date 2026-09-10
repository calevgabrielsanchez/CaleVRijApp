import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAddressCard, faEnvelope, faLocationDot } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <section class="section-view contact-view">
      <div class="section-title">
        <div><span class="kicker">CONTACT / 05</span><h2>Contacto</h2></div>
        <fa-icon [icon]="faAddressCard" class="title-icon" />
      </div>
      <div class="contact-card">
        <fa-icon [icon]="faAddressCard" class="contact-icon" />
        <h3>Conecta con CaleVR</h3>
        <p>Estamos disponibles para acompañar tu próxima experiencia inmersiva.</p>
        <div class="contact-line"><fa-icon [icon]="faEnvelope" /> hola@calevr.app</div>
        <div class="contact-line"><fa-icon [icon]="faLocationDot" /> Madrid · España</div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .section-view { padding: 22px 18px; }
    .section-title { align-items: flex-start; display: flex; justify-content: space-between; }
    .kicker { color: var(--magenta); font-size: 10px; font-weight: 700; letter-spacing: .14em; }
    h2 { color: var(--cyan); font-size: 24px; letter-spacing: -.03em; margin: 6px 0 25px; }
    .title-icon { color: var(--magenta); font-size: 23px; }
    .contact-card { background: var(--panel-soft); border: 1px solid var(--line); padding: 24px 18px; }
    .contact-icon { color: var(--magenta); font-size: 26px; }
    h3 { color: #e0f7ff; font-size: 18px; margin: 14px 0 7px; }
    p { color: var(--cyan-muted); font-size: 11px; line-height: 1.5; margin: 0 0 20px; }
    .contact-line { border-top: 1px solid var(--line-muted); color: var(--cyan); font-size: 11px; padding: 11px 0 0; margin-top: 10px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  readonly faAddressCard = faAddressCard;
  readonly faEnvelope = faEnvelope;
  readonly faLocationDot = faLocationDot;
}

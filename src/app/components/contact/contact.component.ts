import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebook, faFacebookMessenger, faInstagram, faTiktok, faWhatsapp, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faClock, faEnvelope, faPaperPlane, faQuestionCircle, faShareNodes, faShoppingBag, faStar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <section class="section-view contact-view">
      <div class="section-title">
        <div><span class="kicker">CONTACT / 05</span><h2>Sección de contacto</h2></div>
      </div>
      <div class="pixel-card intro-card">
        <span class="pixel-label">PLAYER SUPPORT</span>
        <h3>Conecta con CaleVRije</h3>
        <p>¿Tienes una misión, una duda o una idea? Estamos listos para leerte.</p>
        <div class="quick-links">
          <a class="quick-link whatsapp" href="https://wa.me/34600000000" target="_blank" rel="noopener noreferrer"><fa-icon [icon]="faWhatsapp" /><span>WhatsApp Business<small>Chat directo</small></span></a>
          <a class="quick-link messenger" href="https://m.me/calevrije" target="_blank" rel="noopener noreferrer"><fa-icon [icon]="faFacebookMessenger" /><span>Messenger<small>Escríbenos</small></span></a>
        </div>
      </div>

      <div class="pixel-card form-card">
        <span class="pixel-label">SEND MESSAGE</span>
        <form (submit)="sendEmail(name.value, email.value, message.value); $event.preventDefault()">
          <label for="contact-name">Nombre</label>
          <input id="contact-name" #name type="text" placeholder="Tu nombre" required>
          <label for="contact-email">Email</label>
          <input id="contact-email" #email type="email" placeholder="tu@email.com" required>
          <label for="contact-message">Mensaje</label>
          <textarea id="contact-message" #message rows="4" placeholder="Escribe tu mensaje..." required></textarea>
          <button class="send-button" type="submit"><fa-icon [icon]="faPaperPlane" /> Enviar a contacto@calevrije.com</button>
        </form>
      </div>

      <div class="pixel-card social-card">
        <span class="pixel-label"><fa-icon [icon]="faShareNodes" /> SOCIAL LINK</span>
        <div class="social-grid">
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"><fa-icon [icon]="faFacebook" /> Facebook</a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"><fa-icon [icon]="faInstagram" /> Instagram</a>
          <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer"><fa-icon [icon]="faTiktok" /> TikTok</a>
          <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer"><fa-icon [icon]="faYoutube" /> YouTube</a>
          <a class="store-link" href="https://listado.mercadolibre.com/" target="_blank" rel="noopener noreferrer"><fa-icon [icon]="faShoppingBag" /> Tienda Mercado Libre</a>
        </div>
      </div>

      <div class="info-grid">
        <div class="pixel-card info-card"><fa-icon [icon]="faClock" /><div><span class="pixel-label">HORARIOS</span><p>Lun - Vie<br><b>09:00 - 18:00</b></p></div></div>
          <button class="pixel-card info-card info-link" type="button" (click)="policiesOpen.set(true)"><fa-icon [icon]="faQuestionCircle" /><div><span class="pixel-label">LEGAL MENU</span><p>Políticas y<br><b>condiciones</b></p></div></button>
      </div>

      <div id="faq" class="pixel-card faq-card">
        <span class="pixel-label">FAQ / LEVEL SELECT</span>
        <details><summary>¿Cómo puedo comprar?</summary><p>Visita nuestra tienda de Mercado Libre para consultar productos y disponibilidad.</p></details>
        <details><summary>¿Ofrecen soporte para AR?</summary><p>Sí, escríbenos y te ayudaremos a preparar tu experiencia.</p></details>
      </div>

      <a class="testimonials-button" href="mailto:contacto@calevrije.com?subject=Testimonio"><fa-icon [icon]="faStar" /> Dejar un testimonio</a>
      <p class="contact-email"><fa-icon [icon]="faEnvelope" /> contacto@calevrije.com</p>

      @if (policiesOpen()) {
        <div class="legal-overlay" role="presentation" (click)="policiesOpen.set(false)">
          <section class="legal-modal" role="dialog" aria-modal="true" aria-labelledby="legal-title" (click)="$event.stopPropagation()">
            <button class="legal-close" type="button" aria-label="Cerrar políticas" (click)="policiesOpen.set(false)">×</button>
            <span class="pixel-label">LEGAL / TERMS</span>
            <h3 id="legal-title">Políticas y condiciones</h3>
            <p class="legal-updated">Última actualización: septiembre de 2026</p>
            <h4>Aviso legal</h4>
            <p>CaleVRije es una plataforma de experiencias inmersivas y contenidos digitales. Para consultas, puedes contactar en contacto@calevrije.com.</p>
            <h4>Condiciones de uso</h4>
            <p>El uso de este sitio implica la aceptación de estas condiciones. La información se ofrece con fines informativos y puede actualizarse sin previo aviso. El usuario debe utilizar la plataforma de forma lícita y responsable.</p>
            <h4>Privacidad</h4>
            <p>Los datos enviados mediante el formulario se utilizarán únicamente para responder a la consulta. No se venderán ni cederán a terceros salvo obligación legal o necesidad técnica del servicio.</p>
            <h4>Cookies y tecnologías</h4>
            <p>El sitio puede usar almacenamiento local y tecnologías técnicas necesarias para recordar preferencias y garantizar su funcionamiento. Puedes bloquearlas desde la configuración de tu navegador.</p>
            <h4>Propiedad intelectual</h4>
            <p>Las marcas, textos, diseños, imágenes y contenidos de CaleVRije pertenecen a sus respectivos titulares. No está permitida su reproducción o uso comercial sin autorización.</p>
            <h4>Restricciones y responsabilidad</h4>
            <p>No se permite usar el sitio para actividades ilegales, introducir código malicioso, intentar acceder a zonas no autorizadas o vulnerar los derechos de otras personas. CaleVRije no garantiza la disponibilidad permanente de enlaces o servicios externos.</p>
            <h4>Enlaces externos</h4>
            <p>Los enlaces a WhatsApp, redes sociales y tiendas llevan a servicios de terceros, sujetos a sus propias políticas y condiciones.</p>
            <h4>Contacto</h4>
            <p>Para ejercer tus derechos o resolver cualquier duda legal, escribe a contacto@calevrije.com.</p>
          </section>
        </div>
      }
    </section>
  `,
  styles: [`
    :host { display: block; }
    .contact-view fa-icon { color: #8f3f12 !important; }
    .section-view { color: #3b1d0d; padding: 18px 14px 26px; }
    .contact-view { background: repeating-linear-gradient(0deg, #14275412 0 1px, transparent 1px 4px); min-height: 100%; }
    .section-title { align-items: flex-start; display: flex; justify-content: space-between; }
    .kicker, .pixel-label { color: #8f3f12; font-size: 10px; font-weight: 700; letter-spacing: .12em; }
    h2 { color: #a94d16; font-size: 23px; letter-spacing: -.03em; margin: 5px 0 18px; }
    .title-icon { color: #a94d16; font-size: 23px; }
    .pixel-card { background: repeating-linear-gradient(0deg, #8f3f1212 0 1px, transparent 1px 4px), linear-gradient(145deg, #ffe39a, #ffc45b); border: 3px solid #8f3f12; box-shadow: inset 0 0 0 2px #fff0bd, inset 0 -8px 18px #d9781833, 3px 3px 0 #b85c1c; margin-bottom: 14px; padding: 13px; }
    h3 { color: #3b1d0d; font-size: 18px; margin: 9px 0 6px; }
    p { color: #5c2b10; font-size: 11px; line-height: 1.5; margin: 0 0 13px; }
    .quick-links, .info-grid { display: grid; gap: 8px; grid-template-columns: 1fr 1fr; }
    .quick-link, .info-link { align-items: center; color: #173b2c; display: flex; gap: 9px; text-decoration: none; }
    .quick-link { background: #ffe0a0; border: 2px solid #b85c1c; padding: 9px 7px; }
    .quick-link fa-icon { font-size: 19px; }.quick-link span { font-size: 10px; font-weight: 700; }.quick-link small { display: block; font-size: 8px; font-weight: 400; margin-top: 3px; }
    .whatsapp fa-icon { color: #176b42 !important; }.messenger fa-icon { color: #3859a4 !important; }
    form { display: grid; gap: 5px; }.form-card label { color: #5c2b10; font-size: 10px; font-weight: 700; margin-top: 4px; }.form-card input, .form-card textarea { background: #fff0c9; border: 2px solid #b85c1c; color: #3b1d0d; font: inherit; font-size: 11px; outline: 0; padding: 8px; resize: vertical; }.form-card input:focus, .form-card textarea:focus { border-color: #8f3f12; }.send-button, .testimonials-button { align-items: center; background: #8f3f12; border: 0; color: #fff0c9; cursor: pointer; display: flex; font: inherit; font-size: 10px; gap: 7px; justify-content: center; margin-top: 7px; padding: 11px 8px; text-decoration: none; }.social-card .pixel-label { align-items: center; display: flex; gap: 6px; }.social-grid { display: grid; gap: 6px; grid-template-columns: 1fr 1fr; margin-top: 10px; }.social-grid a { align-items: center; background: #ffe0a0; border: 2px solid #b85c1c; color: #3b1d0d; display: flex; font-size: 10px; font-weight: 700; gap: 5px; justify-content: center; padding: 8px 5px; text-align: center; text-decoration: none; }.social-grid a:nth-child(1) fa-icon { color: #1877f2 !important; }.social-grid a:nth-child(2) fa-icon { color: #e1306c !important; }.social-grid a:nth-child(3) fa-icon { color: #111 !important; }.social-grid a:nth-child(4) fa-icon { color: #ff0000 !important; }.social-grid .store-link { grid-column: 1 / -1; }.info-card { align-items: flex-start; display: flex; gap: 10px; margin-bottom: 0; }.info-card > fa-icon { color: #8f3f12 !important; font-size: 20px; }.info-card p { margin: 7px 0 0; }.info-link { display: flex; }.faq-card { margin-top: 14px; }.faq-card details { border-top: 2px solid #e48b38; color: #3b1d0d; font-size: 10px; padding: 9px 0 0; margin-top: 9px; }.faq-card summary { cursor: pointer; font-weight: 700; }.faq-card p { margin: 7px 0 0; }.testimonials-button { margin: 18px 3px 10px; }.contact-email { font-size: 10px; margin: 0; text-align: center; }
    .legal-overlay { align-items: center; background: #142754cc; display: flex; inset: 0; justify-content: center; padding: 12px; position: fixed; z-index: 20; }.legal-modal { background: linear-gradient(145deg, #ffe39a, #ffc45b); border: 3px solid #8f3f12; box-shadow: inset 0 0 0 2px #fff0bd, 4px 4px 0 #54220d; color: #3b1d0d; max-height: 90%; overflow-y: auto; padding: 18px 15px 15px; position: relative; width: min(390px, 100%); }.legal-modal h3 { border-bottom: 2px solid #d97818; padding-bottom: 8px; }.legal-modal h4 { color: #8f3f12; font-size: 11px; margin: 15px 0 4px; }.legal-modal p { font-size: 10px; margin-bottom: 8px; }.legal-modal .legal-updated { color: #8f3f12; font-size: 9px; }.legal-close { background: #8f3f12; border: 0; color: #fff0c9; cursor: pointer; font-size: 22px; line-height: 1; padding: 3px 8px; position: absolute; right: 8px; top: 8px; }
   `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  readonly policiesOpen = signal(false);
  readonly faClock = faClock;
  readonly faEnvelope = faEnvelope;
  readonly faFacebook = faFacebook;
  readonly faFacebookMessenger = faFacebookMessenger;
  readonly faInstagram = faInstagram;
  readonly faPaperPlane = faPaperPlane;
  readonly faQuestionCircle = faQuestionCircle;
  readonly faShareNodes = faShareNodes;
  readonly faShoppingBag = faShoppingBag;
  readonly faStar = faStar;
  readonly faTiktok = faTiktok;
  readonly faWhatsapp = faWhatsapp;
  readonly faYoutube = faYoutube;

  sendEmail(name: string, email: string, message: string): void {
    const subject = encodeURIComponent(`Mensaje de ${name}`);
    const body = encodeURIComponent(`${message}\n\nResponder a: ${email}`);
    window.location.href = `mailto:contacto@calevrije.com?subject=${subject}&body=${body}`;
  }
}

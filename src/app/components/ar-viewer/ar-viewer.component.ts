import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, OnDestroy, output, signal, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowsRotate, faCamera, faCube, faXmark } from '@fortawesome/free-solid-svg-icons';

type ViewerMode = 'starting' | 'mindar' | 'xr' | 'camera' | 'simulator' | 'error';

interface XrLayer {
  framebuffer: WebGLFramebuffer | null;
  getViewport(view: XrView): { x: number; y: number; width: number; height: number } | null;
}

interface XrView {
  projectionMatrix: Float32Array;
  transform: { inverse: { matrix: Float32Array } };
}

interface XrPose {
  views: readonly XrView[];
}

interface XrReferenceSpace {}
interface XrImageSpace {}
interface XrImageTrackingResult {
  trackingState: 'tracked' | 'emulated';
  imageSpace: XrImageSpace;
}
interface XrImagePose {
  transform: { matrix: Float32Array };
}

interface XrFrame {
  session: XrSession;
  getViewerPose(referenceSpace: XrReferenceSpace): XrPose | null;
  getImageTrackingResults?: () => readonly XrImageTrackingResult[];
  getPose?: (space: XrImageSpace, baseSpace: XrReferenceSpace) => XrImagePose | null;
}

interface XrSession {
  renderState: { baseLayer?: XrLayer };
  updateRenderState(state: { baseLayer: XrLayer }): void;
  requestReferenceSpace(type: string): Promise<XrReferenceSpace>;
  requestAnimationFrame(callback: (time: number, frame: XrFrame) => void): number;
  end(): Promise<void>;
}

interface XrSystem {
  isSessionSupported(mode: 'immersive-ar'): Promise<boolean>;
  requestSession(mode: 'immersive-ar', options?: Record<string, unknown>): Promise<XrSession>;
}

interface BrowserWithXr extends Navigator {
  xr?: XrSystem;
}

interface WindowWithXrLayer extends Window {
  XRWebGLLayer?: new (session: XrSession, context: WebGLRenderingContext) => XrLayer;
}

@Component({
  selector: 'app-ar-viewer',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './ar-viewer.component.html',
  styleUrl: './ar-viewer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArViewerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('camera', { static: true }) private readonly camera?: ElementRef<HTMLVideoElement>;
  @ViewChild('xrCanvas', { static: true }) private readonly xrCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('mindarHost', { static: true }) private readonly mindarHost?: ElementRef<HTMLDivElement>;

  readonly closed = output<void>();
  readonly experienceTitle = 'Metro';
  readonly videoUrl: SafeResourceUrl;
  readonly mode = signal<ViewerMode>('starting');
  readonly markerDetected = signal(false);
  readonly message = signal('Buscando capacidades AR...');
  readonly faArrowsRotate = faArrowsRotate;
  readonly faCamera = faCamera;
  readonly faCube = faCube;
  readonly faXmark = faXmark;

  private cameraStream?: MediaStream;
  private xrSession?: XrSession;
  private xrReferenceSpace?: XrReferenceSpace;
  private gl?: WebGLRenderingContext;
  private program?: WebGLProgram;
  private frameHandle = 0;
  private mindarScene?: HTMLElement;

  constructor() {
    const sanitizer = inject(DomSanitizer);
    this.videoUrl = sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.youtube.com/embed/GkelMun0huY?autoplay=1&playsinline=1&controls=1&rel=0'
    );
  }

  ngAfterViewInit(): void {
    void this.startExperience();
  }

  ngOnDestroy(): void {
    this.stopCamera();
    this.stopMindAr();
    if (this.xrSession) void this.xrSession.end();
    if (this.frameHandle) cancelAnimationFrame(this.frameHandle);
  }

  close(): void {
    this.stopCamera();
    this.stopMindAr();
    if (this.xrSession) void this.xrSession.end();
    this.closed.emit();
  }

  async retry(): Promise<void> {
    this.message.set('Reintentando conexión AR...');
    await this.startExperience();
  }

  private async startExperience(): Promise<void> {
    if (await this.startMindAr()) return;
    const xr = (navigator as BrowserWithXr).xr;
    if (xr) {
      try {
        if (await xr.isSessionSupported('immersive-ar')) {
          await this.startWebXr(xr);
          return;
        }
      } catch {
        // Fall back to the camera when WebXR is blocked or unavailable.
      }
    }
    await this.startCameraFallback(true);
  }

  private async startMindAr(): Promise<boolean> {
    const host = this.mindarHost?.nativeElement;
    if (!host || !customElements.get('a-scene')) return false;

    try {
      const targetResponse = await fetch('/metro.mind', { method: 'HEAD' });
      if (!targetResponse.ok) return false;
      const scene = document.createElement('a-scene');
      scene.setAttribute('mindar-image', 'imageTargetSrc: /metro.mind; autoStart: true; uiLoading: no; uiScanning: no; uiError: no; maxTrack: 1');
      scene.setAttribute('embedded', '');
      scene.setAttribute('vr-mode-ui', 'enabled: false');
      scene.setAttribute('device-orientation-permission-ui', 'enabled: false');
      scene.setAttribute('renderer', 'colorManagement: true; physicallyCorrectLights: true');

      const camera = document.createElement('a-camera');
      camera.setAttribute('position', '0 0 0');
      camera.setAttribute('look-controls', 'enabled: false');
      const target = document.createElement('a-entity');
      target.setAttribute('mindar-image-target', 'targetIndex: 0');
      target.addEventListener('targetFound', () => {
        this.markerDetected.set(true);
        this.message.set('Marcador Metro detectado');
      });
      target.addEventListener('targetLost', () => {
        this.markerDetected.set(false);
        this.message.set('Apunta la cámara al marcador Metro');
      });
      scene.append(camera, target);
      host.replaceChildren(scene);
      this.mindarScene = scene;
      await Promise.race([
        new Promise<void>((resolve) => scene.addEventListener('loaded', () => resolve(), { once: true })),
        new Promise<never>((_, reject) => window.setTimeout(() => reject(new Error('MindAR tardó demasiado en iniciar')), 8000))
      ]);
      this.mode.set('mindar');
      this.message.set('Apunta la cámara al marcador Metro');
      return true;
    } catch {
      this.stopMindAr();
      return false;
    }
  }

  private async startWebXr(xr: XrSystem): Promise<void> {
    const canvas = this.xrCanvas?.nativeElement;
    const layerConstructor = (window as WindowWithXrLayer).XRWebGLLayer;
    if (!canvas || !layerConstructor) throw new Error('WebXR no disponible');

    const context = canvas.getContext('webgl', { alpha: true, antialias: true });
    if (!context) throw new Error('WebGL no disponible');

    const marker = await this.loadMarker();
    this.gl = context;
    this.program = this.createProgram(context);
    const session = await xr.requestSession('immersive-ar', {
      requiredFeatures: ['image-tracking', 'local-floor'],
      optionalFeatures: ['dom-overlay'],
      domOverlay: { root: this.xrCanvas?.nativeElement.parentElement },
      trackedImages: [{ image: marker, widthInMeters: 0.15 }]
    });
    this.xrSession = session;
    session.updateRenderState({ baseLayer: new layerConstructor(session, context) });
    this.xrReferenceSpace = await session.requestReferenceSpace('local-floor');
    this.mode.set('xr');
    this.message.set('Apunta la cámara al marcador');
    this.renderXrFrame();
  }

  private async startCameraFallback(simulator: boolean): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia || !this.camera?.nativeElement) {
      this.mode.set('error');
      this.message.set(window.isSecureContext
        ? 'Este navegador no permite acceder a la cámara.'
        : 'La cámara requiere HTTPS o abrir la aplicación instalada.');
      return;
    }

    try {
      this.cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      this.camera.nativeElement.srcObject = this.cameraStream;
      await this.camera.nativeElement.play();
      this.mode.set(simulator ? 'simulator' : 'camera');
      this.message.set(simulator ? 'Objeto AR simulado para PC' : 'Vista AR de cámara activa');
    } catch (error) {
      this.mode.set('error');
      const name = error instanceof DOMException ? error.name : '';
      this.message.set(name === 'NotAllowedError'
        ? 'Concede el permiso de cámara en los ajustes del dispositivo.'
        : 'No se pudo iniciar la cámara. Comprueba que no esté siendo usada por otra aplicación.');
    }
  }

  private renderXrFrame(): void {
    if (!this.xrSession || !this.xrReferenceSpace || !this.gl || !this.program) return;
    this.frameHandle = this.xrSession.requestAnimationFrame((time, frame) => {
      const pose = frame.getViewerPose(this.xrReferenceSpace as XrReferenceSpace);
      const layer = this.xrSession?.renderState.baseLayer;
      const markerResult = frame.getImageTrackingResults?.().find((result) => result.trackingState === 'tracked');
      const markerPose = markerResult && frame.getPose
        ? frame.getPose(markerResult.imageSpace, this.xrReferenceSpace as XrReferenceSpace)
        : null;
      const markerMatrix = markerPose?.transform.matrix;
      if (this.markerDetected() !== Boolean(markerMatrix)) this.markerDetected.set(Boolean(markerMatrix));
      if (pose && layer) this.drawXrScene(pose, layer, time, markerMatrix);
      this.renderXrFrame();
    });
  }

  private drawXrScene(pose: XrPose, layer: XrLayer, time: number, markerMatrix?: Float32Array): void {
    const gl = this.gl;
    const program = this.program;
    if (!gl || !program) return;
    gl.bindFramebuffer(gl.FRAMEBUFFER, layer.framebuffer);
    gl.useProgram(program);
    const position = gl.getAttribLocation(program, 'aPosition');
    const matrix = gl.getUniformLocation(program, 'uViewProjection');
    const pulse = gl.getUniformLocation(program, 'uPulse');
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -0.45, -0.35, -2.2, 0.45, -0.35, -2.2, 0, 0.45, -2.2
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
    gl.uniform1f(pulse, 0.72 + Math.sin(time / 500) * 0.2);

    for (const view of pose.views) {
      const viewport = layer.getViewport(view);
      if (!viewport) continue;
      gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      if (!markerMatrix) continue;
      const viewProjection = this.multiplyMatrices(view.projectionMatrix, view.transform.inverse.matrix);
      gl.uniformMatrix4fv(matrix, false, this.multiplyMatrices(viewProjection, markerMatrix));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    gl.deleteBuffer(buffer);
  }

  private async loadMarker(): Promise<ImageBitmap> {
    const response = await fetch('/ar-marker.jpg');
    if (!response.ok) throw new Error('No se encontró la imagen del marcador');
    return createImageBitmap(await response.blob());
  }

  private createProgram(gl: WebGLRenderingContext): WebGLProgram {
    const vertex = this.compileShader(gl, gl.VERTEX_SHADER, `
      attribute vec3 aPosition;
      uniform mat4 uViewProjection;
      uniform float uPulse;
      void main() { gl_Position = uViewProjection * vec4(aPosition * uPulse, 1.0); }
    `);
    const fragment = this.compileShader(gl, gl.FRAGMENT_SHADER, `
      precision mediump float;
      void main() { gl_FragColor = vec4(0.95, 0.12, 0.63, 0.9); }
    `);
    const program = gl.createProgram();
    if (!program) throw new Error('No se pudo crear el programa AR');
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('No se pudo enlazar el programa AR');
    return program;
  }

  private compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
    const shader = gl.createShader(type);
    if (!shader) throw new Error('No se pudo crear el shader AR');
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('No se pudo compilar el shader AR');
    return shader;
  }

  private multiplyMatrices(a: Float32Array, b: Float32Array): Float32Array {
    const result = new Float32Array(16);
    for (let column = 0; column < 4; column++) {
      for (let row = 0; row < 4; row++) {
        result[column * 4 + row] = a[row] * b[column * 4]
          + a[4 + row] * b[column * 4 + 1]
          + a[8 + row] * b[column * 4 + 2]
          + a[12 + row] * b[column * 4 + 3];
      }
    }
    return result;
  }

  private stopCamera(): void {
    this.cameraStream?.getTracks().forEach((track) => track.stop());
    this.cameraStream = undefined;
  }

  private stopMindAr(): void {
    const host = this.mindarHost?.nativeElement;
    host?.querySelectorAll('video').forEach((video) => {
      const stream = (video as HTMLVideoElement).srcObject;
      if (stream instanceof MediaStream) stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    });
    host?.replaceChildren();
    this.mindarScene = undefined;
  }
}

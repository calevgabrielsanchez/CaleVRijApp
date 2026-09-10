export type ItemStatus = 'published' | 'draft' | 'archived';

export interface CaleItem {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: ItemStatus;
  content: string;
  updatedAt: string;
}

export const DEFAULT_ITEMS: CaleItem[] = [
  {
    id: 'welcome',
    title: 'Bienvenida CaleVR',
    slug: 'bienvenida-calevr',
    type: 'Pantalla',
    status: 'published',
    content: 'Explora una nueva dimensión de aprendizaje inmersivo.',
    updatedAt: '2026-09-08T09:24:00.000Z'
  },
  {
    id: 'vr-lab',
    title: 'Laboratorio VR',
    slug: 'laboratorio-vr',
    type: 'Experiencia',
    status: 'published',
    content: 'Un espacio seguro para crear, probar y compartir experiencias.',
    updatedAt: '2026-09-07T16:42:00.000Z'
  },
  {
    id: 'safety',
    title: 'Guía de seguridad',
    slug: 'guia-de-seguridad',
    type: 'Documento',
    status: 'draft',
    content: 'Recuerda calibrar tu espacio antes de iniciar una sesión.',
    updatedAt: '2026-09-06T11:10:00.000Z'
  },
  {
    id: 'about',
    title: 'Sobre CaleVR',
    slug: 'sobre-calevr',
    type: 'Página',
    status: 'archived',
    content: 'Tecnología inmersiva con una mirada humana y accesible.',
    updatedAt: '2026-08-29T13:05:00.000Z'
  }
];

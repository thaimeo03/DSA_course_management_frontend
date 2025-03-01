import { DocumentType } from '@app/enums/document.enum';

export const DOC_ICONS: Record<DocumentType, string> = {
  other: '/documents/doc-icon.png',
  pdf: '/documents/pdf-icon.png',
  docx: '/documents/docx-icon.png',
} as const;

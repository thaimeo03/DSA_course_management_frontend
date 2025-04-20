import { FileType } from '@app/enums/document';

export const DOC_ICONS: Record<string, string> = {
  [FileType.DOCX]: '/documents/docx.png',
  [FileType.PDF]: '/documents/pdf.png',
  [FileType.PPTX]: '/documents/pptx.png',
  [FileType.UNKNOWN]: '/documents/unknown.png',
} as const;

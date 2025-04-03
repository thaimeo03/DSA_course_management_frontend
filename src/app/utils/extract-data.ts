import { DocumentType } from '@app/enums/document';
import { YTB_URL_REGEX } from '@app/constants';

export const extractVideoId = (url: string): string => {
  const regExp = YTB_URL_REGEX;
  const match = url.match(regExp);
  return match ? match[1] : '';
};

export const extractFileType = (url: string): DocumentType => {
  const ext = url.split('.').pop();

  switch (ext) {
    case 'pdf':
      return DocumentType.PDF;
    case 'docx':
      return DocumentType.DOCX;
    default:
      return DocumentType.OTHER;
  }
};

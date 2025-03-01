import { DocumentType } from '@app/enums/document.enum';

export const extractVideoId = (url: string): string => {
  const regExp =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
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

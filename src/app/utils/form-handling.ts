import { AbstractControl, ValidationErrors } from '@angular/forms';
import { YTB_URL_REGEX } from '@app/constants';
import { BidvFileLike } from '@bidv-ui/kit';

export const getNameFile = (file: BidvFileLike): string => {
  return file.name;
};

export const getTypeFile = (file: BidvFileLike) => {
  return file?.type ?? '';
};

export const getFileSize = (file: BidvFileLike) => {
  if (!file.size) {
    return '0 MB';
  }

  const size = file.size / 1024 / 1024; // Convert to MB
  return size.toFixed(2) + ' MB';
};

export const getIconSrc = (type: string) => {
  if (type.includes('image')) {
    return './image.png';
  }

  return '';
};

export const validateYoutubeUrl = (
  control: AbstractControl,
): ValidationErrors | null => {
  const url = control.value;
  if (!url) {
    return null;
  }

  const regExp = YTB_URL_REGEX;
  const match = url.match(regExp);

  return match ? null : { invalidYoutubeUrl: true };
};

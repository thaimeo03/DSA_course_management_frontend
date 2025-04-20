import { AbstractControl, ValidationErrors } from '@angular/forms';
import { YTB_URL_REGEX } from '@app/constants';
import { DOC_ICONS } from '@app/constants/document';
import { FileType } from '@app/enums/document';
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

  if (DOC_ICONS[type]) return DOC_ICONS[type];

  return DOC_ICONS[FileType.UNKNOWN];
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

export const validateUrl = (
  control: AbstractControl,
): ValidationErrors | null => {
  if (!control.value) {
    return null;
  }

  try {
    const url = new URL(control.value);
    // Check if protocol is http or https
    return url.protocol === 'http:' || url.protocol === 'https:'
      ? null
      : { invalidUrl: true };
  } catch (e) {
    return { invalidUrl: true };
  }
};

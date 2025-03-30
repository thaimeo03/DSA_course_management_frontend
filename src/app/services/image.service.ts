import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ImageFolder } from '@app/enums/image';
import { UploadImagesResponse } from '@app/models/image';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  readonly #httpClient = inject(HttpClient);

  uploadImages(files: File[], folder: ImageFolder) {
    const formData = new FormData();

    formData.append('cloudFolder', folder);

    files.forEach((file) => {
      formData.append('images', file);
    });

    return this.#httpClient.post<UploadImagesResponse>(
      '/images/upload',
      formData,
    );
  }
}

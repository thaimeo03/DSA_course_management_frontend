import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DocumentFolder } from '@app/enums/document';
import { MessageResponse } from '@app/models';
import {
  CreateDocumentBody,
  CreateDocumentResponse,
  GetDocumentsResponse,
  UpdateDocumentBody,
  UploadDocumentResponse,
} from '@app/models/document';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  readonly #httpClient = inject(HttpClient);

  uploadDocument(file: File, cloudFolder: DocumentFolder) {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('cloudFolder', cloudFolder);

    return this.#httpClient.post<UploadDocumentResponse>(
      '/documents/upload',
      formData,
    );
  }

  createDocument(body: CreateDocumentBody) {
    return this.#httpClient.post<CreateDocumentResponse>('/documents', body);
  }

  updateDocument(id: string, body: UpdateDocumentBody) {
    return this.#httpClient.patch<MessageResponse>(`/documents/${id}`, body);
  }

  deleteDocument(id: string) {
    return this.#httpClient.delete<MessageResponse>(`/documents/${id}`);
  }

  getDocumentsByLessonId(lessonId: string) {
    return this.#httpClient.get<GetDocumentsResponse>(
      `/documents/lesson/${lessonId}`,
    );
  }
}

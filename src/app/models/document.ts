import { DataResponse } from '.';

export interface DocumentData {
  id: string;
  title: string;
  fileUrl: string;
  createdAt: string;
}

export interface CreateDocumentBody {
  title: string;
  fileUrl: string;
  lessonId: string;
}

export interface UpdateDocumentBody
  extends Partial<Omit<CreateDocumentBody, 'lessonId'>> {}

export type UploadDocumentResponse = DataResponse<string>;
export type CreateDocumentResponse = DataResponse<DocumentData>;
export type GetDocumentsResponse = DataResponse<DocumentData[]>;

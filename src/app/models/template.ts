import { ProgrammingLanguage } from '@app/enums';
import { DataResponse } from '.';

// Get template
export interface GetTemplateParams {
  language: ProgrammingLanguage;
  problemId: string;
}

export type GetTemplateResponse = DataResponse<TemplateData>;

interface TemplateData {
  id: string;
  code: string;
  language: ProgrammingLanguage;
}

// Create template
export interface CreateTemplateBody {
  code: string;
  language: ProgrammingLanguage;
  problemId: string;
}

export type CreateTemplateResponse = DataResponse<TemplateData>;

// Update template
export interface UpdateTemplateBody
  extends Partial<Omit<CreateTemplateBody, 'problemId'>> {}

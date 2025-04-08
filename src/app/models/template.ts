import { ProgrammingLanguage } from '@app/enums';
import { DataResponse } from '.';

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

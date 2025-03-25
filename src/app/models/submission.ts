import { ProgrammingLanguage } from '@app/enums';
import { DataResponse } from '.';

export interface ExecuteCodeBody {
  code: string;
  language: ProgrammingLanguage;
  problemId: string;
}

interface ExecuteCodeData {
  message: string;
  status: 1 | 0;
}

export type ExecuteCodeResponse = DataResponse<ExecuteCodeData>;

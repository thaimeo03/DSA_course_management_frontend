import { ProgrammingLanguage } from '@app/enums';
import { DataResponse } from '.';
import { SubmissionStatus } from '@app/enums/submission';

// Execute code
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

// Get submission history
export type GetSubmissionHistoryResponse = DataResponse<
  SubmissionHistoryData[]
>;

export interface SubmissionHistoryData {
  id: string;
  status: SubmissionStatus;
  createdAt: string;
  sourceCode: SourceCode;
}

interface SourceCode {
  code: string;
  language: ProgrammingLanguage;
}

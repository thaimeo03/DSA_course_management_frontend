import { DataResponse } from '.';

export interface TestSuiteData {
  id: string;
  functionName: string;
  inputTypes: string[];
  inputSuit: string;
  outputType: string;
  expectedOutputSuit: string;
}

export interface CreateTestSuiteBody {
  functionName: string;
  inputTypes: string[];
  inputSuit: string;
  outputType: string;
  expectedOutputSuit: string;
  problemId: string;
}

export interface UpdateTestSuiteBody {
  functionName?: string;
  inputTypes?: string[];
  inputSuit?: string;
  outputType?: string;
  expectedOutputSuit?: string;
}

export type GetTestSuiteResponse = DataResponse<TestSuiteData>;

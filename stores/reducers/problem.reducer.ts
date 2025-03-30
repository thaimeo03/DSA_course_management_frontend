import { ProblemRepositoryData } from '@app/models/problem';
import { createReducer, on } from '@ngrx/store';
import { setProblemData } from 'stores/actions/problem.action';

export interface ProblemState {
  problemData: ProblemRepositoryData | null;
}

const initialState: ProblemState = {
  problemData: null,
};

export const problemReducer = createReducer(
  initialState,
  on(setProblemData, (state, problem) => ({
    ...state,
    ...problem,
  })),
);

import { ProblemState } from 'stores/reducers/problem.reducer';

export const selectProblemData = (state: { problem: ProblemState }) =>
  state.problem;

import { createAction, props } from '@ngrx/store';
import { ProblemState } from 'stores/reducers/problem.reducer';

export const setProblemData = createAction(
  '[Problem] Set Problem Data',
  props<Partial<ProblemState>>(),
);

import { createAction, props } from '@ngrx/store';
import { AuthState } from 'stores/reducers/auth.reducer';

export const setAuth = createAction(
  '[Auth] Set Auth',
  props<Partial<AuthState>>(),
);

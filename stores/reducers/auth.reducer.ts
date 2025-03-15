import { MeData } from '@app/models/user';
import { createReducer, on } from '@ngrx/store';
import { setAuth } from 'stores/actions/auth.action';

export interface AuthState {
  isAuthenticated: boolean;
  me: MeData | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  me: null,
};

export const authReducer = createReducer(
  initialState,
  on(setAuth, (state, auth) => ({
    ...state,
    ...auth,
  })),
);

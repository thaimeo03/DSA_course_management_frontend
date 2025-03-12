import { createReducer, on } from '@ngrx/store';
import { setAuth } from 'stores/actions/auth.action';

export interface AuthState {
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
};

export const authReducer = createReducer(
  initialState,
  on(setAuth, (state, { isAuthenticated }) => ({
    ...state,
    isAuthenticated,
  })),
);

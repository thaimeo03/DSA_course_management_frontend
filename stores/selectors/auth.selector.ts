import { AuthState } from 'stores/reducers/auth.reducer';

export const selectAuthState = (state: { auth: AuthState }) => state.auth;

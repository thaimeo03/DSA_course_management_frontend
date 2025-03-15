import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { ROUTES } from '@app/constants/routes';
import { UserService } from '@app/services/user.service';
import { Store } from '@ngrx/store';
import { setAuth } from 'stores/actions/auth.action';
import { selectAuthState } from 'stores/selectors/auth.selector';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const userService = inject(UserService);
  const store = inject(Store);

  let isAuthenticated = false;

  store.select(selectAuthState).subscribe((auth) => {
    isAuthenticated = auth.isAuthenticated;
  });

  if (isAuthenticated) return true;

  // Call api to check if user is authenticated
  try {
    const res = await userService.getMe();
    // Update store
    store.dispatch(setAuth({ isAuthenticated: true, me: res.data }));
  } catch (error) {
    router.navigate([ROUTES.login]);
    return false;
  }

  return true;
};

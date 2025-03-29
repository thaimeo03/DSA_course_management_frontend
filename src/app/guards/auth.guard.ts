import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { ROUTES } from '@app/constants/routes';
import { UserService } from '@app/services/user.service';
import { Store } from '@ngrx/store';
import { setAuth } from 'stores/actions/auth.action';
import { selectAuthState } from 'stores/selectors/auth.selector';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const userService = inject(UserService);
  const store = inject(Store);

  const authState = await firstValueFrom(store.select(selectAuthState));

  if (authState.isAuthenticated) return true;

  try {
    const res = await firstValueFrom(userService.getMe());
    const me = res.data;

    store.dispatch(setAuth({ isAuthenticated: true, me }));
  } catch (error) {
    router.navigate([ROUTES.login]);
    return false;
  }
  return true;
};

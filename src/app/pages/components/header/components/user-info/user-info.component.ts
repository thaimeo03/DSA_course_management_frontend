import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ROLES } from '@app/constants/user';
import { MeData } from '@app/models/user';
import { UserService } from '@app/services/user.service';
import { injectMutation } from '@bidv-api/angular';
import { BidvDropdownModule } from '@bidv-ui/core';
import { BidvAvatarNavigationComponent } from '@bidv-ui/kit';
import { Store } from '@ngrx/store';
import { ROUTES } from 'src/app/constants/routes';
import { LinkItem } from 'src/app/models';
import { setAuth } from 'stores/actions/auth.action';

@Component({
  selector: 'app-user-info',
  imports: [
    CommonModule,
    BidvAvatarNavigationComponent,
    RouterLink,
    BidvDropdownModule,
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
})
export class UserInfoComponent {
  #userService = inject(UserService);
  #mutation = injectMutation();
  #store = inject(Store);

  @Input({ required: true }) me: MeData | null = null;

  protected loginLink = ROUTES.login;
  protected registerLink = ROUTES.register;

  protected authenticatedNavLinks: LinkItem[] = [
    { label: 'My account', link: ROUTES.account },
    { label: 'Order', link: ROUTES.order },
  ];

  protected anonymousNavLinks: LinkItem[] = [
    { label: 'Login', link: ROUTES.login },
    { label: 'Register', link: ROUTES.register },
  ];

  protected ROLES = ROLES;

  // Mutations
  #logoutMutation = this.#mutation({
    mutationFn: () => this.#userService.logout(),
    onSuccess: () => {
      this.me = null;
      this.#store.dispatch(setAuth({ isAuthenticated: false, me: null })); // Update store
    },
  });

  handleLogout() {
    this.#logoutMutation.mutate(null);
  }
}

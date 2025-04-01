import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ROLES } from '@app/constants/user';
import { Role } from '@app/enums/user';
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
export class UserInfoComponent implements OnChanges {
  #userService = inject(UserService);
  #mutation = injectMutation();
  #store = inject(Store);

  @Input({ required: true }) me: MeData | null = null;

  protected loginLink = ROUTES.login;
  protected registerLink = ROUTES.register;

  protected authenticatedNavLinks: LinkItem[] = [
    { label: 'Tài khoản của tôi', link: ROUTES.account },
    { label: 'Đơn hàng', link: ROUTES.order },
  ];

  protected anonymousNavLinks: LinkItem[] = [
    { label: 'Đăng nhập', link: ROUTES.login },
    { label: 'Đăng ký', link: ROUTES.register },
  ];

  protected ROLES = ROLES;

  // Mutations
  #logoutMutation = this.#mutation({
    mutationFn: () => this.#userService.logout(),
    onSuccess: () => {
      this.#store.dispatch(setAuth({ isAuthenticated: false, me: null })); // Update store
      window.location.reload(); // Reload page to update UI
    },
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['me'] && this.me) {
      if (this.me && this.me.role === Role.Admin) {
        this.authenticatedNavLinks.unshift({
          label: 'Trang quản trị',
          link: ROUTES.admin,
        });
      }
    }
  }

  handleLogout() {
    this.#logoutMutation.mutate(null);
  }
}

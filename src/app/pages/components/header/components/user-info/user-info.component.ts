import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BidvDropdownModule } from '@bidv-ui/core';
import { BidvAvatarNavigationComponent } from '@bidv-ui/kit';
import { ROUTES } from 'src/app/constants/routes';
import { LinkItem } from 'src/app/models';

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
  protected isAuthenticated = true;
  protected loginLink = ROUTES.login;
  protected registerLink = ROUTES.register;

  protected authenticatedNavLinks: LinkItem[] = [
    { label: 'My account', link: ROUTES.account },
    { label: 'Order', link: ROUTES.order },
    { label: 'Logout', link: ROUTES.login },
  ];

  protected anonymousNavLinks: LinkItem[] = [
    { label: 'Login', link: ROUTES.login },
    { label: 'Register', link: ROUTES.register },
  ];
}

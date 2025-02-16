import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BidvDropdownModule } from '@bidv-ui/core';
import { BidvAvatarNavigationComponent } from '@bidv-ui/kit';
import { ROUTES } from 'src/app/constants/routes';

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
}

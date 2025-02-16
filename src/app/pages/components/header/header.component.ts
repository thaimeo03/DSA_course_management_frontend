import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BidvContainerDirective } from '@bidv-ui/layout';
import { ROUTES } from 'src/app/constants/routes';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { CommonModule } from '@angular/common';
import { LinkItem } from 'src/app/models';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    BidvContainerDirective,
    RouterLink,
    UserInfoComponent,
    RouterLinkActive,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  protected navLinks: LinkItem[] = [
    {
      label: 'Home',
      link: ROUTES.home,
    },
    {
      label: 'Purchased course',
      link: ROUTES.purchasedCourse,
    },
  ];
}

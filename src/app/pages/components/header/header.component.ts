import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BidvContainerDirective } from '@bidv-ui/layout';
import { ROUTES } from 'src/app/constants/routes';
import { UserInfoComponent } from './components/user-info/user-info.component';

@Component({
  selector: 'app-header',
  imports: [BidvContainerDirective, RouterLink, UserInfoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  protected homeLink = ROUTES.home;
}

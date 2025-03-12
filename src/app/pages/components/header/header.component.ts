import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BidvContainerDirective } from '@bidv-ui/layout';
import { ROUTES } from 'src/app/constants/routes';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { CommonModule } from '@angular/common';
import { LinkItem } from 'src/app/models';
import { Store } from '@ngrx/store';
import { selectAuthState } from 'stores/selectors/auth.selector';

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
  protected isAuthenticated = false;
  #store = inject(Store);

  protected navLinks: LinkItem[] = [
    {
      label: 'Home',
      link: ROUTES.home,
    },
  ];

  constructor() {
    this.#store
      .select(selectAuthState)
      .subscribe((auth) => {
        this.isAuthenticated = auth.isAuthenticated;
      })
      .unsubscribe();

    if (this.isAuthenticated) {
      this.navLinks.push({
        label: 'Purchased course',
        link: ROUTES.purchasedCourse,
      });
    }
  }
}

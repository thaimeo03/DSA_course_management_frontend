import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BidvContainerDirective } from '@bidv-ui/layout';
import { ROUTES } from 'src/app/constants/routes';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { CommonModule } from '@angular/common';
import { LinkItem } from 'src/app/models';
import { Store } from '@ngrx/store';
import { injectQuery } from '@bidv-api/angular';
import { UserService } from '@app/services/user.service';
import { setAuth } from 'stores/actions/auth.action';
import { MeData } from '@app/models/user';

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
  #userService = inject(UserService);
  #store = inject(Store);
  #query = injectQuery();

  protected navLinks: LinkItem[] = [
    {
      label: 'Home',
      link: ROUTES.home,
    },
  ];

  protected me: MeData | null = null;

  // Queries
  protected getMeQuery = this.#query({
    queryKey: ['me'],
    queryFn: () => this.#userService.getMe(),
    retry: 0,
  });

  constructor() {
    this.initData();
  }

  // Init data
  private initData() {
    this.getMeQuery.result$.subscribe((res) => {
      const data = res.data;
      if (!data) return;

      const me = data.data;
      this.me = me;

      // Set user data to store
      this.#store.dispatch(setAuth({ isAuthenticated: true, me: me }));

      // Update nav links
      this.navLinks = [
        {
          label: 'Home',
          link: ROUTES.home,
        },
        {
          label: 'Purchased course',
          link: ROUTES.purchasedCourse,
        },
      ];
    });
  }
}

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
import { BidvBadgeModule } from '@bidv-ui/kit';
import { BidvHintModule } from '@bidv-ui/core';
import { PointService } from '@app/services/point.service';
import { PointData } from '@app/models/point';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    BidvContainerDirective,
    RouterLink,
    UserInfoComponent,
    RouterLinkActive,
    BidvBadgeModule,
    BidvHintModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  #userService = inject(UserService);
  #pointService = inject(PointService);
  #store = inject(Store);
  #query = injectQuery();

  protected navLinks: LinkItem[] = [
    {
      label: 'Trang chủ',
      link: ROUTES.home,
    },
  ];

  protected me: MeData | null = null;
  protected myPointData: PointData | null = null;

  // Queries
  protected getMeQuery = this.#query({
    queryKey: ['me'],
    queryFn: () => this.#userService.getMe(),
    retry: 0,
  });

  protected getMyPointQuery = this.#query({
    queryKey: ['my-point'],
    queryFn: () => this.#pointService.getMyPoint(),
    retry: 0,
  });

  constructor() {
    this.initData();
  }

  // Init data
  private initData() {
    // Get me
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
          label: 'Trang chủ',
          link: ROUTES.home,
        },
        {
          label: 'Khóa học của tôi',
          link: ROUTES.purchasedCourse,
        },
      ];
    });

    // Get point
    this.getMyPointQuery.result$.subscribe((res) => {
      const data = res.data;
      if (!data) return;

      this.myPointData = data.data;
    });
  }
}

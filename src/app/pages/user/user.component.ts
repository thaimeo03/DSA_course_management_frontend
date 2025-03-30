import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BidvDividerDirective, BidvTabsModule } from '@bidv-ui/kit';
import { BreadcrumbsComponent } from '../components/breadcrumbs/breadcrumbs.component';
import { LinkItem } from 'src/app/models';
import { ROUTES } from 'src/app/constants/routes';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user',
  imports: [
    CommonModule,
    BidvTabsModule,
    BreadcrumbsComponent,
    RouterOutlet,
    BidvDividerDirective,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent {
  private router = inject(Router);

  protected breadcrumbs: LinkItem[] = [
    {
      label: 'Trang chủ',
      link: ROUTES.home,
    },
    {
      label: 'Tài khoản của tôi',
      link: ROUTES.account,
    },
  ];

  protected tabLinks: LinkItem[] = [
    {
      label: 'Tài khoản',
      link: ROUTES.account,
    },
    {
      label: 'Đơn hàng',
      link: ROUTES.order,
    },
  ];
  protected activeItemIndex = 0;

  constructor() {
    // Set active tab
    this.activeItemIndex = this.tabLinks.findIndex(
      (item) => item.link === this.router.url,
    );
  }

  protected onTabClick(link: any) {
    this.router.navigate([link]);
  }
}

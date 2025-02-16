import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
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
export class UserComponent implements OnInit {
  private router = inject(Router);

  protected breadcrumbs: LinkItem[] = [
    {
      label: 'Home',
      link: ROUTES.home,
    },
    {
      label: 'My account',
      link: ROUTES.account,
    },
  ];

  protected activeItemIndex = 0;

  protected tabLinks: LinkItem[] = [
    {
      label: 'Account',
      link: ROUTES.account,
    },
    {
      label: 'Order',
      link: ROUTES.order,
    },
  ];

  ngOnInit(): void {
    // Set active tab
    this.router.events.subscribe(() => {
      this.activeItemIndex = this.tabLinks.findIndex(
        (item) => item.link === this.router.url,
      );
    });
  }

  protected onTabClick(link: string) {
    this.router.navigate([link]);
  }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BidvIconComponent, BidvSvgModule } from '@bidv-ui/core';
import {
  BidvContainerDirective,
  BidvNavigationAsideComponent,
  BidvNavigationNode,
} from '@bidv-ui/layout';
import { BidvNavigationModule } from '@bidv-ui/experimental';
import { HeaderComponent } from '../components/header/header.component';
import { Router, RouterOutlet } from '@angular/router';
import { ROUTES } from '@app/constants/routes';

@Component({
  selector: 'app-admin',
  imports: [
    CommonModule,
    BidvNavigationAsideComponent,
    BidvNavigationModule,
    BidvSvgModule,
    HeaderComponent,
    RouterOutlet,
    BidvContainerDirective,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  #router = inject(Router);

  protected asideItems: BidvNavigationNode[] = [
    {
      label: 'Khóa học',
      icon: 'bidvIconDocumentLandscapeData',
      link: ROUTES.adminCourse,
    },
    {
      label: 'Bài giảng',
      icon: 'bidvIconContentViewGalleryOutline',
      link: ROUTES.adminLecture,
    },
    {
      label: 'Bài tập',
      icon: 'bidvIconClipboardTaskOutline',
      link: ROUTES.adminProblem,
    },
    {
      label: 'Mã giảm giá',
      icon: 'bidvIconMoneyOutline',
      link: ROUTES.adminCoupon,
    },
  ];

  activeAside: BidvNavigationNode | undefined = this.asideItems.find((item) =>
    this.#router.url.includes(item.link as string),
  );
  activeAsideDrawerItem: BidvNavigationNode | undefined = this.asideItems[0]
    ?.subItems
    ? this.asideItems[0]?.subItems[0]
    : undefined;

  expanded = false;

  onExpended(): void {
    this.expanded = !this.expanded;
  }

  getFirstLeaf(
    value: any,
    items: BidvNavigationNode[],
  ): BidvNavigationNode | null {
    for (const item of items) {
      const found = item.subItems?.find(
        (subItem) =>
          subItem.label === value.label && subItem.icon === value.icon,
      );

      if (found) {
        this.activeAside = item;

        return item;
      }

      if (item.subItems) {
        const parent = this.getFirstLeaf(value, item.subItems);

        if (parent) {
          this.activeAside = item;

          return item;
        }
      }
    }

    return null;
  }

  onSelectMenu(menu: BidvNavigationNode | undefined): void {
    this.activeAside = menu;

    if (menu?.link) {
      this.#router.navigate([menu.link]);
    }

    if (!menu) {
      return;
    }

    if (menu.subItems && menu.subItems.length > 0) {
      const firstLeft = getFirstLeaf([menu]);

      if (firstLeft) {
        this.activeAsideDrawerItem = firstLeft;
      }
    }
  }
}

function getFirstLeaf(
  items: readonly BidvNavigationNode[],
): BidvNavigationNode | null {
  for (const item of items) {
    // Check if the current item is a leaf node
    if (!item.subItems || item.subItems.length === 0) {
      return item; // Return the first leaf node found
    }

    // Recursively check in subItems
    const leaf = getFirstLeaf(item.subItems);

    if (leaf) {
      return leaf; // Return the first leaf found in subItems
    }
  }

  return null; // Return null if no leaf is found
}

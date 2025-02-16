import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BidvLinkDirective, BidvSvgModule } from '@bidv-ui/core';
import { BidvBreadcrumbsModule } from '@bidv-ui/kit';
import { LinkItem } from 'src/app/models';

@Component({
  selector: 'app-breadcrumbs',
  imports: [
    CommonModule,
    BidvBreadcrumbsModule,
    BidvLinkDirective,
    RouterLink,
    BidvSvgModule,
  ],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent {
  @Input({ required: true }) breadcrumbs: LinkItem[] = [];
}

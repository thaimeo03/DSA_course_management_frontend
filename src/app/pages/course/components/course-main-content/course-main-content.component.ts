import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '@app/constants/routes';
import { extractVideoId } from '@app/utils/extract-data';
import { BidvButtonModule, BidvSvgModule } from '@bidv-ui/core';

@Component({
  selector: 'app-course-main-content',
  imports: [CommonModule, BidvSvgModule, BidvButtonModule],
  templateUrl: './course-main-content.component.html',
  styleUrl: './course-main-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrouseMainContentComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);

  protected videoUrl!: SafeResourceUrl;
  protected isPurchased = true;

  protected invitedInfo = [
    {
      title: 'Buy once, learn for life',
      icon: 'bidvIconCheckmark',
    },
    {
      title: 'Continuous course updates',
      icon: 'bidvIconCheckmark',
    },
    {
      title: 'Video quality 1080p, 1440p',
      icon: 'bidvIconCheckmark',
    },
    {
      title: 'Diverse exercise system',
      icon: 'bidvIconCheckmark',
    },
    {
      title: 'Support to fix bugs while studying',
      icon: 'bidvIconCheckmark',
    },
    {
      title: 'Provide complete documentation and Github source code',
      icon: 'bidvIconCheckmark',
    },
  ];

  constructor() {
    this.initVideo('https://youtu.be/K5HtEA8Egms');
  }

  // Display video
  private initVideo(url: string) {
    const videoId = extractVideoId(url);
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`,
    );
  }

  // Handlers
  protected handleAction() {
    if (this.isPurchased) {
      this.router.navigate([ROUTES.lecture], {
        relativeTo: this.activatedRoute,
      });
    } else {
    }
  }

  protected handleNavigateProblem() {
    if (this.isPurchased) {
      this.router.navigate([ROUTES.problemRepository], {
        relativeTo: this.activatedRoute,
      });
    }
  }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BidvButtonModule, BidvSvgModule } from '@bidv-ui/core';

@Component({
  selector: 'app-course-main-content',
  imports: [CommonModule, BidvSvgModule, BidvButtonModule],
  templateUrl: './course-main-content.component.html',
  styleUrl: './course-main-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrouseMainContentComponent {
  private sanitizer = inject(DomSanitizer);

  protected videoUrl!: SafeResourceUrl;
  protected isPurchased = false;

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

  private initVideo(url: string) {
    const videoId = this.extractVideoId(url);
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`,
    );
  }

  private extractVideoId(url: string): string {
    const regExp =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : '';
  }
}

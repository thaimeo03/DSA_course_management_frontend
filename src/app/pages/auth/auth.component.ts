import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BidvButtonModule } from '@bidv-ui/core';
import { BidvCardModule } from '@bidv-ui/kit';
import {
  BidvCardActionModule,
  BidvCardContentModule,
  BidvCardHeaderModule,
} from '@bidv-ui/layout';
import * as THREE from 'three';
import GLOBE from 'vanta/dist/vanta.globe.min';

@Component({
  selector: 'app-auth',
  imports: [
    RouterOutlet,
    BidvCardModule,
    BidvCardHeaderModule,
    BidvCardContentModule,
    BidvCardActionModule,
    BidvButtonModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements AfterViewInit, OnDestroy {
  @ViewChild('background') background!: ElementRef;
  vantaEffect: any;

  ngAfterViewInit(): void {
    this.vantaEffect = GLOBE({
      el: this.background.nativeElement,
      THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: '#ffb71b',
      color2: '#ffefeb',
      backgroundColor: '#006b68',
    });
  }

  ngOnDestroy(): void {
    if (this.vantaEffect) this.vantaEffect.destroy();
  }
}

import { Component, Input } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { BidvContainerDirective } from '@bidv-ui/layout';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, BidvContainerDirective, HeaderComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  @Input() showHeader = true;
}

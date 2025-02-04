import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  BidvButtonModule,
  BidvLabelModule,
  BidvSvgModule,
  BidvTextfieldControllerModule,
} from '@bidv-ui/core';
import { BidvInputModule, BidvInputPasswordModule } from '@bidv-ui/kit';

@Component({
  selector: 'app-login',
  imports: [
    BidvButtonModule,
    BidvLabelModule,
    BidvInputModule,
    BidvInputPasswordModule,
    BidvTextfieldControllerModule,
    BidvSvgModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor() {}
}

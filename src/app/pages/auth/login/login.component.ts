import { Component } from '@angular/core';
import {
  BidvButtonModule,
  BidvLabelModule,
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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor() {}
}

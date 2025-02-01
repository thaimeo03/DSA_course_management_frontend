import { Component } from '@angular/core';
import { BidvButtonModule } from '@bidv-ui/core';

@Component({
  selector: 'app-login',
  imports: [BidvButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor() {}
}

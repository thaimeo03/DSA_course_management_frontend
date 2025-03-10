import { Component } from '@angular/core';
import { AuthFormComponent } from '../components/auth-form/auth-form.component';

@Component({
  selector: 'app-login',
  imports: [AuthFormComponent],
  template: `<app-auth-form [isLogin]="true" />`,
})
export class LoginComponent {
  constructor() {}
}

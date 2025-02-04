import { Component } from '@angular/core';
import { AuthFormComponent } from '../components/auth-form/auth-form.component';

@Component({
  selector: 'app-register',
  imports: [AuthFormComponent],
  template: `<app-auth-form [isLogin]="false" />`,
})
export class RegisterComponent {}

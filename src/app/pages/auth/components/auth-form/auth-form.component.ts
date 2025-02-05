import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  BidvButtonModule,
  BidvLabelModule,
  BidvTextfieldControllerModule,
} from '@bidv-ui/core';
import { BidvInputModule, BidvInputPasswordModule } from '@bidv-ui/kit';
import { ROUTES } from 'src/app/constants/routes';

interface AuthItem {
  title: string;
  desc: string;
  switchText: string;
  switchLink: string;
  switchDesc: string;
}

@Component({
  selector: 'app-auth-form',
  imports: [
    ReactiveFormsModule,
    BidvButtonModule,
    BidvLabelModule,
    BidvInputModule,
    BidvInputPasswordModule,
    BidvTextfieldControllerModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss',
})
export class AuthFormComponent {
  @Input({ required: true }) isLogin = true;

  protected loginItem: AuthItem = {
    title: 'Login',
    desc: 'Enter your email below to login to your account',
    switchText: "Don't have an account?",
    switchLink: ROUTES.register,
    switchDesc: 'Sign up',
  };

  protected registerItem: AuthItem = {
    title: 'Register',
    desc: 'Enter your information to create your account',
    switchText: 'Already have an account?',
    switchLink: ROUTES.login,
    switchDesc: 'Login',
  };

  protected loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  protected registerForm = new FormGroup({
    fullName: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });

  handleSubmit() {
    // Handle call API login and register
    console.log(this.isLogin ? this.loginForm.value : this.registerForm.value);
  }
}

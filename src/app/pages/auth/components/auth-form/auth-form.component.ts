import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  BidvButtonModule,
  BidvErrorModule,
  BidvLabelModule,
  BidvTextfieldControllerModule,
} from '@bidv-ui/core';
import {
  BIDV_VALIDATION_ERRORS,
  BidvFieldErrorPipeModule,
  BidvInputModule,
  BidvInputPasswordModule,
} from '@bidv-ui/kit';
import { of } from 'rxjs';
import { ROUTES } from 'src/app/constants/routes';

interface AuthItem {
  title: string;
  desc: string;
  switchText: string;
  switchLink: string;
  switchDesc: string;
}

function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    return password === confirmPassword
      ? null
      : { other: 'Passwords do not match' };
  };
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
    BidvErrorModule,
    BidvFieldErrorPipeModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss',
  providers: [
    {
      provide: BIDV_VALIDATION_ERRORS,
      useValue: {
        required: 'This field is required',
        email: 'Please enter a valid email',
        minlength: ({ requiredLength }: { requiredLength: string }) =>
          of(`Minimum length — ${requiredLength}`),
        maxLength: ({ requiredLength }: { requiredLength: string }) =>
          of(`Maximum length — ${requiredLength}`),
        // passwordMismatch: 'Passwords do not match',
      },
    },
  ],
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
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  protected registerForm = new FormGroup(
    {
      fullName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        passwordMatchValidator,
      ]),
    },
    (control) =>
      Object.values((control as FormGroup).controls).every(({ valid }) => valid)
        ? null
        : { other: 'Form is invalid' },
  );

  handleSubmit() {
    if (this.isLogin) {
      this.loginForm.markAllAsTouched();
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}

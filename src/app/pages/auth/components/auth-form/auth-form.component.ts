import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
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
import { LoginBody } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

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
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmPassword');

    if (!passwordControl || !confirmPasswordControl) return null;

    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    if (confirmPassword && password !== confirmPassword) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
    } else {
      confirmPasswordControl.setErrors(null);
    }

    return null;
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
        passwordMismatch: 'Confirm password do not match',
      },
    },
  ],
})
export class AuthFormComponent {
  private userService = inject(UserService);

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
      ]),
    },
    {
      validators: passwordMatchValidator(),
    },
  );

  handleSubmit() {
    if (this.isLogin) {
      this.loginForm.markAllAsTouched();
      if (this.loginForm.invalid) return;

      this.userService.login(this.loginForm.value as LoginBody).subscribe({
        next: (data) => {
          console.log(data.message);
        },
        error: (err) => {
          console.log(err);
          (this.loginForm.get('email') as FormControl).setErrors({
            failed: err.error.message,
          });
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}

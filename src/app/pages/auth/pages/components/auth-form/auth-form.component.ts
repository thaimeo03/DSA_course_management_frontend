import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ROUTES } from 'src/app/constants/routes';
import { LoginBody, RegisterBody } from '@app/models/user';
import { UserService } from 'src/app/services/user.service';
import { setAuth } from 'stores/actions/auth.action';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormComponent {
  private router = inject(Router);
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  #store = inject(Store);

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

  protected failed = '';

  protected loginMutation = this.userService.loginMutation();
  protected registerMutation = this.userService.registerMutation();

  constructor() {
    this.loginForm.statusChanges.subscribe(() => {
      if (this.failed) this.failed = '';
    });

    this.registerForm.statusChanges.subscribe(() => {
      if (this.failed) this.failed = '';
    });
  }

  handleSubmit() {
    if (this.isLogin) {
      this.loginForm.markAllAsTouched();

      if (this.loginForm.invalid) return;

      this.loginMutation.mutate(this.loginForm.value as LoginBody, {
        onSuccess: () => {
          this.#store.dispatch(setAuth({ isAuthenticated: true }));
          this.router.navigate([ROUTES.home]);
        },
        onError: (err: any) => {
          if (err.status === 0 || err.status === 500) return;

          this.failed = err.error.message;
          this.cdr.markForCheck();
        },
      });
    } else {
      if (this.registerForm.invalid) return;

      this.loginMutation.mutate(this.registerForm.value as RegisterBody, {
        onSuccess: () => {
          this.#store.dispatch(setAuth({ isAuthenticated: true }));
          this.router.navigate([ROUTES.home]);
        },
        onError: (err: any) => {
          if (err.status === 0 || err.status === 500) return;

          this.failed = err.error.message;
          this.cdr.markForCheck();
        },
      });
    }
  }
}

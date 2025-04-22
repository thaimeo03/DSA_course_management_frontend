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
import { injectMutation } from '@bidv-api/angular';
import { ErrorResponse } from '@app/models';

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
        required: 'Trường này là bắt buộc',
        email: 'Vui lòng nhập email hợp lệ',
        minlength: ({ requiredLength }: { requiredLength: string }) =>
          of(`Độ dài tối thiểu — ${requiredLength}`),
        maxlength: ({ requiredLength }: { requiredLength: string }) =>
          of(`Độ dài tối đa — ${requiredLength}`),
        passwordMismatch: 'Mật khẩu xác nhận không khớp',
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
  #mutation = injectMutation();

  @Input({ required: true }) isLogin = true;

  protected loginItem: AuthItem = {
    title: 'Đăng nhập',
    desc: 'Nhập email của bạn để đăng nhập vào tài khoản',
    switchText: 'Chưa có tài khoản?',
    switchLink: ROUTES.register,
    switchDesc: 'Đăng ký',
  };

  protected registerItem: AuthItem = {
    title: 'Đăng ký',
    desc: 'Nhập thông tin của bạn để tạo tài khoản',
    switchText: 'Đã có tài khoản?',
    switchLink: ROUTES.login,
    switchDesc: 'Đăng nhập',
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

  // Mutation
  protected loginMutation = this.#mutation({
    mutationFn: (body: LoginBody) => this.userService.login(body),
    onSuccess: () => {
      this.#store.dispatch(setAuth({ isAuthenticated: true }));
      this.router.navigate([ROUTES.home]);
    },
    onError: (error: ErrorResponse) => {
      if (error.status === 0 || error.status === 500) return;
      const errorMessage = error.error.message;
      this.failed = Array.isArray(errorMessage)
        ? errorMessage[0]
        : errorMessage;

      this.cdr.markForCheck();
    },
  });

  protected registerMutation = this.#mutation({
    mutationFn: (body: RegisterBody) => this.userService.register(body),
    onSuccess: () => {
      this.#store.dispatch(setAuth({ isAuthenticated: true }));
      this.router.navigate([ROUTES.home]);
    },
    onError: (error: ErrorResponse) => {
      if (error.status === 0 || error.status === 500) return;
      const errorMessage = error.error.message;
      this.failed = Array.isArray(errorMessage)
        ? errorMessage[0]
        : errorMessage;

      this.cdr.markForCheck();
    },
  });

  // Mutation result
  protected loginMutationResult = this.loginMutation.result;
  protected registerMutationResult = this.registerMutation.result;

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

      this.loginMutation.mutate(this.loginForm.value as LoginBody);
    } else {
      if (this.registerForm.invalid) return;

      this.registerMutation.mutate(this.registerForm.value as RegisterBody, {
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

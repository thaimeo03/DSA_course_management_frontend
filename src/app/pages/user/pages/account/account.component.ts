import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ImageFolder } from '@app/enums/image';
import { MeData, UpdateProfileBody } from '@app/models/user';
import { ImageService } from '@app/services/image.service';
import { UserService } from '@app/services/user.service';
import { injectMutation, injectQueryClient } from '@bidv-api/angular';
import { BidvDay } from '@bidv-ui/cdk';
import {
  BidvAlertService,
  BidvButtonModule,
  BidvErrorModule,
  BidvTextfieldControllerModule,
} from '@bidv-ui/core';
import {
  BIDV_VALIDATION_ERRORS,
  BidvAvatarComponent,
  BidvBadgeModule,
  BidvDividerDirective,
  BidvFieldErrorPipeModule,
  BidvFileLike,
  BidvFilesModule,
  BidvInputDateModule,
  BidvInputModule,
} from '@bidv-ui/kit';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { setAuth } from 'stores/actions/auth.action';
import { selectAuthState } from 'stores/selectors/auth.selector';

function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === '') return null;

    const isValid = /^\d{10}$/.test(control.value);
    return isValid ? null : { invalidPhoneNumber: true };
  };
}

@Component({
  selector: 'app-account',
  imports: [
    CommonModule,
    BidvDividerDirective,
    ReactiveFormsModule,
    BidvInputModule,
    BidvErrorModule,
    BidvFieldErrorPipeModule,
    BidvTextfieldControllerModule,
    BidvBadgeModule,
    BidvButtonModule,
    BidvInputDateModule,
    BidvAvatarComponent,
    BidvFilesModule,
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: BIDV_VALIDATION_ERRORS,
      useValue: {
        required: 'This field is required',
        minlength: ({ requiredLength }: { requiredLength: string }) =>
          of(`Minimum length — ${requiredLength}`),
        maxLength: ({ requiredLength }: { requiredLength: string }) =>
          of(`Maximum length — ${requiredLength}`),
        invalidPhoneNumber: 'Phone number must be 10 digits',
      },
    },
  ],
})
export class AccountComponent {
  #userService = inject(UserService);
  #imageService = inject(ImageService);
  #store = inject(Store);
  #alerts = inject(BidvAlertService);
  #mutation = injectMutation();
  #queryClient = injectQueryClient();

  protected verified = true;

  protected userInfoForm = new FormGroup({
    fullName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    email: new FormControl({ value: '', disabled: true }),
    phoneNumber: new FormControl('', phoneNumberValidator()),
    dob: new FormControl<BidvDay | null>(null),
    avatar: new FormControl<BidvFileLike | null>(null),
  });

  protected me: MeData | null = null;
  protected avatarSrc: string | SafeResourceUrl | null = this.defaultAvatar;
  protected isUploading = false;

  // Mutations
  #updateProfileMutation = this.#mutation({
    mutationFn: (body: UpdateProfileBody) =>
      this.#userService.updateProfile(body),
    onSuccess: () => {
      this.#queryClient.invalidateQueries({ queryKey: ['me'] });

      this.#alerts
        .open('', {
          status: 'success',
          label: 'Cập nhật thông tin thành công',
        })
        .subscribe();
    },
    onError: () => {
      this.#alerts
        .open('', {
          status: 'error',
          label: 'Cập nhật thông tin thất bại',
        })
        .subscribe();
    },
  });

  #updateProfileWithAvatarMutation = (body: UpdateProfileBody) =>
    this.#mutation({
      mutationFn: (files: BidvFileLike[]) =>
        this.#imageService.uploadImages(files as File[], ImageFolder.Avatar),
      onSuccess: (res) => {
        this.isUploading = false;
        const avatarUrl = res.data[0];

        this.#updateProfileMutation.mutate({
          ...body,
          avatar: avatarUrl,
        });
      },
      onError: () => {
        this.isUploading = false;
        this.#alerts
          .open('', {
            status: 'error',
            label: 'Cập nhật ảnh đại diện thất bại',
          })
          .subscribe();
      },
    });

  protected updateProfileResult = this.#updateProfileMutation.result;

  constructor() {
    this.initData();
    this.trackAvatar();
  }

  private initData() {
    this.#store.select(selectAuthState).subscribe((authState) => {
      const { me } = authState;
      if (!me) return;

      this.me = me;
      this.userInfoForm.patchValue({
        fullName: me.fullName,
        email: me.email,
        phoneNumber: me.phoneNumber,
        dob: me.dateOfBirth
          ? BidvDay.fromUtcNativeDate(new Date(me.dateOfBirth))
          : null,
      });
    });
  }

  private trackAvatar() {
    this.avatarControl.valueChanges.subscribe((file) => {
      if (!file) {
        this.avatarSrc = this.me?.avatar ?? this.defaultAvatar;
        return;
      }

      this.avatarSrc = URL.createObjectURL(file as File);
    });
  }

  // Handlers
  protected removeFile(): void {
    this.avatarControl.setValue(null);
  }

  protected async handleUpdateProfile() {
    if (this.userInfoForm.invalid) return;

    const { fullName, phoneNumber, dob, avatar } = this.userInfoForm.value;

    const profileData: UpdateProfileBody = {
      fullName: fullName as string | undefined,
      phoneNumber: phoneNumber as string | undefined,
      dateOfBirth: dob ? dob?.toUtcNativeDate().toISOString() : undefined,
    };

    if (avatar) {
      this.updateProfileWithAvatar(profileData, avatar);
    } else {
      this.updateProfile(profileData);
    }
  }

  private updateProfile(profileData: UpdateProfileBody) {
    this.#updateProfileMutation.mutate(profileData);
  }

  private updateProfileWithAvatar(
    profileData: UpdateProfileBody,
    avatar: BidvFileLike,
  ) {
    this.isUploading = true;
    this.#updateProfileWithAvatarMutation(profileData).mutate([avatar]);
  }

  // Getters
  get avatarControl() {
    return this.userInfoForm.get('avatar') as FormControl<BidvFileLike | null>;
  }

  get defaultAvatar() {
    return '/avatar.jpg';
  }
}

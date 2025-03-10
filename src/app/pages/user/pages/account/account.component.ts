import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  BidvButtonModule,
  BidvErrorModule,
  BidvTextfieldControllerModule,
} from '@bidv-ui/core';
import {
  BidvAvatarComponent,
  BidvBadgeModule,
  BidvDividerDirective,
  BidvFieldErrorPipeModule,
  BidvFileLike,
  BidvFilesModule,
  BidvInputDateModule,
  BidvInputModule,
} from '@bidv-ui/kit';

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
})
export class AccountComponent {
  protected verified = true;

  protected userInfoForm = new FormGroup({
    fullName: new FormControl('Trần Hồng Thái', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    email: new FormControl({ value: 'thai@gmail.com', disabled: true }, [
      Validators.required,
      Validators.email,
    ]),
    phoneNumber: new FormControl(''),
    dob: new FormControl(null),
    avatar: new FormControl<BidvFileLike | null>(null),
  });

  get avatarControl() {
    return this.userInfoForm.get('avatar') as FormControl<BidvFileLike | null>;
  }

  protected removeFile(): void {
    this.avatarControl.setValue(null);
  }
}

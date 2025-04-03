import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  getFileSize,
  getIconSrc,
  getNameFile,
  getTypeFile,
} from '@app/utils/form-handling';
import { injectMutation } from '@bidv-api/angular';
import { BidvErrorModule, BidvSvgModule } from '@bidv-ui/core';
import {
  BidvBadgeModule,
  BidvFieldErrorPipeModule,
  BidvFileLike,
  BidvFilesModule,
  BidvLineClampModule,
  BidvProgressModule,
} from '@bidv-ui/kit';

import {
  BehaviorSubject,
  finalize,
  map,
  merge,
  Observable,
  of,
  Subject,
  switchMap,
  timer,
} from 'rxjs';

@Component({
  selector: 'app-single-file-upload',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BidvFilesModule,
    BidvSvgModule,
    BidvProgressModule,
    BidvErrorModule,
    BidvFieldErrorPipeModule,
    BidvLineClampModule,
    BidvBadgeModule,
  ],
  templateUrl: './single-file-upload.component.html',
  styleUrls: ['./single-file-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SingleFileUploadComponent implements OnInit {
  @Input({ required: true }) fileControl!: FormControl;
  @Input() acceptedFileTypes: string[] = []; // File types allowed
  @Input() maxMBFileSize = 30; // Default 30MB
  @Input() enableRemove = true;

  protected maxFileSize = 0;

  protected readonly failedFiles$ = new Subject<BidvFileLike | null>();
  protected readonly loadingFiles$ = new Subject<BidvFileLike | null>();
  protected readonly errorMessage$ = new BehaviorSubject<string | null>(null);
  protected loadedFiles$: Observable<BidvFileLike | null> = of(null);
  protected iconSrc = '';

  ngOnInit(): void {
    this.maxFileSize = this.maxMBFileSize * 1024 * 1024;

    this.loadedFiles$ = merge(
      of(this.fileControl.value), // Giá trị ban đầu
      this.fileControl.valueChanges, // Giá trị thay đổi
    ).pipe(switchMap((file) => this.processFile(file)));
  }

  protected processFile(
    file: BidvFileLike | null,
  ): Observable<BidvFileLike | null> {
    this.errorMessage$.next(null);
    this.failedFiles$.next(null);

    // Catch required case
    if (this.fileControl.hasError('required') && this.fileControl.touched) {
      this.errorMessage$.next('Vui lòng upload file');
      return of(null);
    }

    if (this.fileControl.invalid || !file) {
      return of(null);
    }

    this.loadingFiles$.next(file);

    return timer(0).pipe(
      map(() => {
        const error = this.getFileError(file);

        if (error) {
          this.removeFile();
          this.errorMessage$.next(error);
          return null;
        }

        return file;
      }),
      finalize(() => this.loadingFiles$.next(null)),
    );
  }

  private getFileError(file: BidvFileLike): string | null {
    if (file.size && file.size > this.maxFileSize) {
      return `Vui lòng upload file có dung lượng tối đa ${this.maxMBFileSize}MB`;
    }

    if (file.type && !this.acceptedFileTypes.includes(file.type)) {
      return `Vui lòng upload file định dạng ${this.acceptedFileTypes.join(', ')}`;
    }

    return null;
  }

  protected removeFile(): void {
    this.fileControl.setValue(null);
  }

  // Getters
  protected getNameFile(file: BidvFileLike): string {
    return getNameFile(file);
  }

  protected getTypeFile(file: BidvFileLike): string {
    const type = getTypeFile(file);
    this.iconSrc = getIconSrc(type);
    return type;
  }

  protected getFileSize(file: BidvFileLike): string {
    return getFileSize(file);
  }
}

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@bidv-api/angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DocumentService } from '@app/services/document.service';
import {
  BidvAlertService,
  BidvButtonModule,
  BidvErrorModule,
  BidvTextfieldControllerModule,
} from '@bidv-ui/core';
import {
  BIDV_VALIDATION_ERRORS,
  BidvDataListWrapperModule,
  BidvFieldErrorPipeModule,
  BidvFileLike,
  BidvFilesModule,
  BidvInputModule,
  bidvItemsHandlersProvider,
  BidvSelectModule,
} from '@bidv-ui/kit';
import { DialogService } from '@app/services/share/dialog.service';
import { of } from 'rxjs';
import {
  CreateDocumentBody,
  DocumentData,
  UpdateDocumentBody,
} from '@app/models/document';
import { SelectItem } from '@app/models';
import { DocumentFolder, DocumentType } from '@app/enums/document';
import { validateUrl } from '@app/utils/form-handling';
import { SingleFileUploadComponent } from '@app/pages/components/single-file-upload/single-file-upload.component';
import { DocumentViewerComponent } from '@app/pages/components/document-viewer/document-viewer.component';

interface DocumentForm {
  title: FormControl<string>;
  fileUrl: FormControl<string>;
  documentFile: FormControl<BidvFileLike | null>;
}

@Component({
  selector: 'app-admin-lecture-document',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BidvButtonModule,
    BidvInputModule,
    BidvErrorModule,
    BidvFieldErrorPipeModule,
    BidvTextfieldControllerModule,
    BidvFilesModule,
    BidvSelectModule,
    BidvDataListWrapperModule,
    SingleFileUploadComponent,
    DocumentViewerComponent,
  ],
  templateUrl: './admin-lecture-document.component.html',
  styleUrl: './admin-lecture-document.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    bidvItemsHandlersProvider({
      stringify: (item: SelectItem) => `${item.label}`,
    }),
    {
      provide: BIDV_VALIDATION_ERRORS,
      useValue: {
        required: 'Trường này là bắt buộc',
        minlength: ({ requiredLength }: { requiredLength: string }) =>
          of(`Độ dài tối thiểu — ${requiredLength}`),
        maxLength: ({ requiredLength }: { requiredLength: string }) =>
          of(`Độ dài tối đa — ${requiredLength}`),
        invalidUrl: 'Đường dẫn không hợp lệ',
      },
    },
  ],
})
export class AdminLectureDocumentComponent implements OnInit {
  #activatedRoute = inject(ActivatedRoute);
  #documentService = inject(DocumentService);
  #cdr = inject(ChangeDetectorRef);
  #destroyRef = inject(DestroyRef);
  #query = injectQuery();
  #queryClient = injectQueryClient();
  #mutation = injectMutation();
  #alerts = inject(BidvAlertService);
  #dialogs = inject(DialogService);

  // Properties
  protected lectureId = this.#activatedRoute.snapshot.params['id'];
  protected documentData: DocumentData[] = [];
  protected showForm = false;
  protected isLoading = false;
  protected editingDocumentId: string | null = null;

  protected maxMBFileSize = 10; // MB
  protected acceptedFileTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ];

  protected documentTypeE = DocumentType;
  protected documentTypes: SelectItem[] = [
    {
      label: 'Đường dẫn',
      value: DocumentType.Url,
    },
    {
      label: 'Tải lên',
      value: DocumentType.Uploaded,
    },
  ];

  // Form
  protected documentTypeControl = new FormControl<SelectItem | null>(null, {
    validators: [Validators.required],
    nonNullable: true,
  });
  protected documentForm!: FormGroup<DocumentForm>;

  // Queries
  #documentsQuery = this.#query({
    queryKey: ['lecture-documents', this.lectureId],
    queryFn: () => this.#documentService.getDocumentsByLessonId(this.lectureId),
    refetchOnWindowFocus: false,
  });

  // Mutations
  #uploadDocumentMutation = (title: string) =>
    this.#mutation({
      mutationFn: (file: File) =>
        this.#documentService.uploadDocument(file, DocumentFolder.Lesson),
      onSuccess: (res) => {
        const fileUrl = res.data;

        // Create document with the uploaded file URL
        this.#createDocumentMutation.mutate({
          title,
          fileUrl,
          lessonId: this.lectureId,
        });
      },
      onError: () => {
        this.#alerts
          .open('', {
            status: 'error',
            label: 'Tải tài liệu thất bại',
          })
          .subscribe();
      },
    });

  #createDocumentMutation = this.#mutation({
    mutationFn: (body: CreateDocumentBody) =>
      this.#documentService.createDocument(body),
    onSuccess: () => {
      this.isLoading = false;
      this.resetForm();
      this.#queryClient.invalidateQueries({
        queryKey: ['lecture-documents'],
      });

      this.#alerts
        .open('', {
          status: 'success',
          label: 'Thêm tài liệu thành công',
        })
        .subscribe();

      this.#cdr.markForCheck();
    },
    onError: () => {
      this.isLoading = false;
      this.#alerts
        .open('', {
          status: 'error',
          label: 'Thêm tài liệu thất bại',
        })
        .subscribe();
    },
  });

  #updateDocumentMutation = this.#mutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateDocumentBody }) =>
      this.#documentService.updateDocument(id, body),
    onSuccess: () => {
      this.isLoading = false;
      this.resetForm();
      this.#queryClient.invalidateQueries({
        queryKey: ['lecture-documents'],
      });

      this.#alerts
        .open('', {
          status: 'success',
          label: 'Cập nhật tài liệu thành công',
        })
        .subscribe();

      this.#cdr.markForCheck();
    },
    onError: () => {
      this.isLoading = false;
      this.#alerts
        .open('', {
          status: 'error',
          label: 'Cập nhật tài liệu thất bại',
        })
        .subscribe();
    },
  });

  #deleteDocumentMutation = this.#mutation({
    mutationFn: (id: string) => this.#documentService.deleteDocument(id),
    onSuccess: () => {
      this.#queryClient.invalidateQueries({
        queryKey: ['lecture-documents'],
      });

      this.#alerts
        .open('', {
          status: 'success',
          label: 'Xóa tài liệu thành công',
        })
        .subscribe();
    },
    onError: () => {
      this.#alerts
        .open('', {
          status: 'error',
          label: 'Xóa tài liệu thất bại',
        })
        .subscribe();
    },
  });

  // Lifecycle
  ngOnInit(): void {
    this.initForm();
    this.trackDocumentType();
    this.initData();
  }

  // Init data
  private trackDocumentType() {
    this.documentTypeControl.valueChanges.subscribe((item) => {
      if (!item) return;

      const fileUrlControl = this.documentForm.get('fileUrl');
      const documentFileControl = this.documentForm.get('documentFile');

      if (item.value === DocumentType.Url) {
        fileUrlControl?.addValidators([Validators.required, validateUrl]);

        documentFileControl?.clearValidators();
        documentFileControl?.markAsUntouched();
      }
      if (item.value === DocumentType.Uploaded) {
        documentFileControl?.addValidators([Validators.required]);

        fileUrlControl?.clearValidators();
        fileUrlControl?.markAsUntouched();
      }

      fileUrlControl?.updateValueAndValidity();
    });
  }

  private initForm(document?: DocumentData): void {
    this.documentForm = new FormGroup<DocumentForm>({
      title: new FormControl(document?.title || '', {
        validators: [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(300),
        ],
        nonNullable: true,
      }),
      fileUrl: new FormControl(document?.fileUrl || '', {
        nonNullable: true,
      }),
      documentFile: new FormControl<BidvFileLike | null>(null),
    });
  }

  private initData(): void {
    this.#documentsQuery.result$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((res) => {
        if (!res.data) return;

        this.documentData = res.data.data;
        this.#cdr.markForCheck();
      });
  }

  // Handlers
  protected toggleForm(): void {
    this.showForm = !this.showForm;
    if (this.showForm) {
      this.editingDocumentId = null;
      this.initForm();
    }
  }

  protected handleEditDocument(document: DocumentData): void {
    this.showForm = true;
    this.editingDocumentId = document.id;
    this.initForm(document);
    this.documentTypeControl.setValue(this.documentTypes[0]);
  }

  protected handleDeleteDocument(id: string): void {
    this.#dialogs
      .openConfirmDialog('Bạn có chắc chắn muốn xóa tài liệu này?')
      .subscribe((confirmed: any) => {
        if (confirmed) {
          this.#deleteDocumentMutation.mutate(id);
        }
      });
  }

  protected submitDocument(): void {
    this.documentForm.markAllAsTouched();

    if (this.documentForm.invalid) {
      return;
    }

    const formValue = this.documentForm.value;

    if (this.editingDocumentId) {
      this.isLoading = true;
      // Update document
      this.#updateDocumentMutation.mutate({
        id: this.editingDocumentId,
        body: {
          title: formValue.title as string,
          fileUrl: formValue.fileUrl,
        },
      });
    } else {
      // Create document
      if (this.documentType === DocumentType.Uploaded) {
        this.isLoading = true;

        // Upload file first, then create document
        const file = formValue.documentFile as File;
        this.#uploadDocumentMutation(formValue.title as string).mutate(file);
      } else {
        // Create document with URL
        this.#createDocumentMutation.mutate({
          title: formValue.title as string,
          fileUrl: formValue.fileUrl as string,
          lessonId: this.lectureId,
        });
      }
    }
  }

  protected resetForm(): void {
    this.showForm = false;
    this.editingDocumentId = null;
    this.initForm();
  }

  // Getters
  protected get documentType() {
    return this.documentTypeControl.value?.value as DocumentType | null;
  }

  protected get documentFileControl() {
    return this.documentForm.get(
      'documentFile',
    ) as FormControl<BidvFileLike | null>;
  }

  protected getDocumentTypeIcon(fileUrl: string): string {
    const extension = this.getFileExtension(fileUrl);

    switch (extension) {
      case 'pdf':
        return 'assets/documents/pdf-icon.png';
      case 'doc':
      case 'docx':
        return 'assets/documents/docx-icon.png';
      default:
        return 'assets/documents/doc-icon.png';
    }
  }

  protected getFileExtension(fileUrl: string): string {
    const url = new URL(fileUrl);
    const path = url.pathname;
    const filename = path.split('/').pop() || '';
    const extension = filename.split('.').pop() || '';
    return extension.toLowerCase();
  }

  protected getDocumentFileName(fileUrl: string): string {
    const url = new URL(fileUrl);
    const path = url.pathname;
    return path.split('/').pop() || 'Tài liệu';
  }
}

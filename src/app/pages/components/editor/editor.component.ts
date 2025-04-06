import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  INJECTOR,
  Input,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  BIDV_EDITOR_DEFAULT_EXTENSIONS,
  BIDV_EDITOR_EXTENSIONS,
  BidvEditorModule,
  BidvEditorTool,
} from '@bidv-ui/addon-editor';
import { BIDV_SANITIZER } from '@bidv-ui/core';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';

@Component({
  selector: 'app-editor',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, BidvEditorModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: BIDV_SANITIZER,
      useClass: NgDompurifySanitizer,
    },
    {
      provide: BIDV_EDITOR_EXTENSIONS,
      deps: [INJECTOR],
      useFactory: (injector: Injector) => [
        ...BIDV_EDITOR_DEFAULT_EXTENSIONS,
        import('@bidv-ui/addon-editor/extensions/image-editor').then(
          ({ bidvCreateImageEditorExtension }) =>
            bidvCreateImageEditorExtension({ injector }),
        ),
      ],
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditorComponent),
      multi: true,
    },
  ],
})
export class EditorComponent implements ControlValueAccessor {
  @Input() tools = Object.values(BidvEditorTool);

  // ControlValueAccessor implementation
  value: any = '';

  // Methods needed for ControlValueAccessor
  private onChange: any = (_: any) => {};
  private onTouched: any = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Update model value and trigger change
  updateValue(value: any): void {
    this.value = value;
    this.onChange(value);
  }

  // Mark as touched
  onBlur(): void {
    this.onTouched();
  }
}

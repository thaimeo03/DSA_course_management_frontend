import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { basicSetup } from 'codemirror';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  BidvDataListWrapperModule,
  bidvItemsHandlersProvider,
  BidvSelectModule,
  BidvSwitchComponent,
} from '@bidv-ui/kit';
import {
  BidvDataListModule,
  BidvTextfieldControllerModule,
} from '@bidv-ui/core';
import {
  HighlightStyle,
  defaultHighlightStyle,
  syntaxHighlighting,
} from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
import { PROGRAMMING_LANGUAGE } from '@app/constants';
import { ProgrammingLanguage } from '@app/enums';
import { SelectItem } from '@app/models';

type ITheme = 'light' | 'dark';

@Component({
  selector: 'app-code-mirror-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BidvSelectModule,
    BidvDataListModule,
    BidvDataListWrapperModule,
    BidvSwitchComponent,
    BidvTextfieldControllerModule,
  ],
  templateUrl: './code-mirror-editor.component.html',
  styleUrl: './code-mirror-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    bidvItemsHandlersProvider({
      stringify: (item: SelectItem) => `${item.label}`,
    }),
  ],
})
export class CodeMirrorEditorComponent implements OnInit, OnChanges {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;

  @Input() code: string = '';
  @Input() language: ProgrammingLanguage = ProgrammingLanguage.Javascript;

  @Output() languageChangeEvent = new EventEmitter<ProgrammingLanguage>();

  private editor!: EditorView;
  private langConfig = new Compartment();
  private themeConfig = new Compartment();
  private highlightConfig = new Compartment();

  protected languages: SelectItem[] = [
    {
      label: PROGRAMMING_LANGUAGE[ProgrammingLanguage.Javascript],
      value: ProgrammingLanguage.Javascript,
    },
    {
      label: PROGRAMMING_LANGUAGE[ProgrammingLanguage.Python],
      value: ProgrammingLanguage.Python,
    },
    {
      label: PROGRAMMING_LANGUAGE[ProgrammingLanguage.Java],
      value: ProgrammingLanguage.Java,
    },
  ];

  codeEditorForm = new FormGroup({
    language: new FormControl(this.languages[0]),
    darkMode: new FormControl(false),
  });

  ngOnInit() {
    this.loadEditor();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['code']) {
      this.editor?.dispatch({
        changes: {
          from: 0,
          to: this.editor.state.doc.length,
          insert: this.code,
        },
      });
    }

    if (changes['language']) {
      this.languageControl.patchValue(
        this.languages.find((item) => item.value === this.language),
        {
          emitModelToViewChange: false,
        },
      );
    }
  }

  // Config editor
  private loadEditor() {
    const langExtension = this.getLanguageExtension(
      PROGRAMMING_LANGUAGE[ProgrammingLanguage.Javascript],
    );

    const themeExtension = this.getThemeExtension(
      this.codeEditorForm.value.darkMode ? 'dark' : 'light',
    );

    const highlightExtension = this.getHighlightExtension(
      this.codeEditorForm.value.darkMode ? 'dark' : 'light',
    );

    this.editor = new EditorView({
      state: EditorState.create({
        doc: this.code,
        extensions: [
          basicSetup,
          EditorView.lineWrapping,
          this.langConfig.of(langExtension),
          this.themeConfig.of(themeExtension),
          this.highlightConfig.of(highlightExtension),
          this.handleCodeChange(),
        ],
      }),
      parent: this.editorContainer.nativeElement,
    });
  }

  private getLanguageExtension(language: keyof typeof PROGRAMMING_LANGUAGE) {
    switch (language) {
      case 'Python':
        return python();
      case 'Java':
        return java();
      default:
        return javascript();
    }
  }

  private getThemeExtension(theme: ITheme) {
    if (theme === 'dark') {
      return EditorView.theme(
        {
          '&': {
            backgroundColor: '#282c34',
            color: '#c9d1d9',
            minHeight: '600px',
            border: '1px solid #3a3f4b',
          },
          '.cm-content': {
            fontSize: '14px',
            fontFamily: 'Fira Code, monospace',
            padding: '10px',
          },
          '.cm-scroller': {
            overflowY: 'auto',
            maxHeight: '600px',
          },
          '&.cm-focused .cm-cursor': {
            borderLeftColor: '#ffffff',
            borderLeftWidth: '2px',
          },
          '&.cm-focused .cm-selectionBackground': {
            backgroundColor: '#3e4451',
          },
        },
        { dark: true },
      );
    }

    return EditorView.theme(
      {
        '&': {
          backgroundColor: '#f5f8fa',
          color: '#2d2d2d',
          minHeight: '600px',
          border: '1px solid #ccc',
          boxShadow: '2px 2px 8px rgba(0,0,0,0.1)',
        },
        '.cm-content': {
          fontSize: '14px',
          fontFamily: 'Fira Code, monospace',
          padding: '12px',
        },
        '.cm-scroller': {
          overflowY: 'auto',
          maxHeight: '600px',
        },
        '&.cm-focused .cm-cursor': {
          borderLeftColor: '#0078D7',
          borderLeftWidth: '2px',
        },
        '&.cm-focused .cm-selectionBackground': {
          backgroundColor: '#d0e6ff',
        },
        '.cm-gutters': {
          backgroundColor: '#eef1f5',
          color: '#888',
          borderRight: '1px solid #ccc',
        },
      },
      { dark: false },
    );
  }

  private getHighlightExtension(theme: ITheme) {
    if (theme === 'dark') {
      return syntaxHighlighting(
        HighlightStyle.define([
          { tag: t.keyword, color: '#c792ea', fontWeight: 'bold' },
          { tag: t.string, color: '#ecc48d' },
          { tag: t.variableName, color: '#ffcb6b' },
          { tag: t.comment, color: '#676e95', fontStyle: 'italic' },
          { tag: t.function(t.variableName), color: '#82aaff' },
          { tag: t.operator, color: '#89ddff' },
          { tag: t.number, color: '#f78c6c' },
          { tag: t.bool, color: '#ff5370' },
          { tag: t.className, color: '#ffcb6b', fontWeight: 'bold' },
          { tag: t.typeName, color: '#c792ea' },
          { tag: t.propertyName, color: '#addb67' },
          { tag: t.labelName, color: '#ff5370' },
          { tag: t.tagName, color: '#ff5370' },
          { tag: t.attributeName, color: '#ffcb6b' },
          { tag: t.angleBracket, color: '#89ddff' },
          { tag: t.brace, color: '#89ddff' },
          { tag: t.paren, color: '#89ddff' },
          { tag: t.squareBracket, color: '#89ddff' },
          { tag: t.punctuation, color: '#89ddff' },
        ]),
      );
    }

    return syntaxHighlighting(defaultHighlightStyle);
  }

  private handleCodeChange() {
    return EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        this.code = update.state.doc.toString();
      }
    });
  }

  // Handle config change
  protected handleLanguageChange(value: SelectItem) {
    this.editor.dispatch({
      effects: [
        this.langConfig.reconfigure(this.getLanguageExtension(value.label)),
      ],
    });

    this.languageChangeEvent.emit(value.value);
  }

  protected handleThemeChange(value: boolean) {
    this.editor.dispatch({
      effects: [
        this.themeConfig.reconfigure(
          this.getThemeExtension(value ? 'dark' : 'light'),
        ),
        this.highlightConfig.reconfigure(
          this.getHighlightExtension(value ? 'dark' : 'light'),
        ),
      ],
    });
  }

  // Getters
  private get languageControl() {
    return this.codeEditorForm.get('language') as FormControl;
  }
}

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { DOC_ICONS } from '@app/constants/document';
import { DocumentData } from '@app/models/document';
import { extractFileType } from '@app/utils/extract-data';
import { BidvButtonModule, BidvHintModule } from '@bidv-ui/core';
import { BidvLineClampModule } from '@bidv-ui/kit';

@Component({
  selector: 'app-document-viewer',
  imports: [
    CommonModule,
    BidvButtonModule,
    BidvHintModule,
    BidvLineClampModule,
  ],
  templateUrl: './document-viewer.component.html',
  styleUrl: './document-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentViewerComponent {
  @Input({ required: true }) documents!: DocumentData[];
  @Input() enableActions = false;

  @Output() editModeEvent = new EventEmitter<DocumentData>();
  @Output() deleteModeEvent = new EventEmitter<string>();

  // Handlers
  onEditMode(document: DocumentData) {
    this.editModeEvent.emit(document);
  }

  onDeleteMode(documentId: string) {
    this.deleteModeEvent.emit(documentId);
  }

  // Getters
  protected getDocumentIconSrc(fileUrl: string) {
    const fileType = extractFileType(fileUrl);
    return DOC_ICONS[fileType];
  }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProgrammingLanguage } from '@app/enums';
import { BadgeItem } from '@app/models';
import { BidvBadgeModule } from '@bidv-ui/kit';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-language-cell',
  imports: [CommonModule, BidvBadgeModule],
  templateUrl: './language-cell.component.html',
  styleUrl: './language-cell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageCellComponent implements ICellRendererAngularComp {
  protected curLanguageItem: BadgeItem | null = null;

  private javascriptItem: BadgeItem = {
    label: 'Javascript',
    value: ProgrammingLanguage.Javascript,
    class: 'badge-orange',
  };

  private pythonItem: BadgeItem = {
    label: 'Python',
    value: ProgrammingLanguage.Python,
    class: 'badge-blue',
  };

  private javaItem: BadgeItem = {
    label: 'Java',
    value: ProgrammingLanguage.Java,
    class: 'badge-green',
  };

  agInit(params: ICellRendererParams<any, any, any>): void {
    switch (params.value as ProgrammingLanguage) {
      case ProgrammingLanguage.Javascript:
        this.curLanguageItem = this.javascriptItem;
        break;
      case ProgrammingLanguage.Java:
        this.curLanguageItem = this.javaItem;
        break;
      case ProgrammingLanguage.Python:
        this.curLanguageItem = this.pythonItem;
        break;
    }
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return false;
  }
}

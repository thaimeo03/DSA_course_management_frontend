import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BadgeItem } from '@app/models';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-difficulty',
  imports: [CommonModule],
  templateUrl: './difficulty.component.html',
  styleUrl: './difficulty.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DifficultyComponent implements ICellRendererAngularComp {
  private difficultyItems: BadgeItem[] = [
    {
      label: 'Easy',
      value: 0,
      class: 'text-green',
    },
    {
      label: 'Medium',
      value: 1,
      class: 'text-orange',
    },
    {
      label: 'Hard',
      value: 2,
      class: 'text-red',
    },
  ];

  protected curDifficultyItem: BadgeItem = this.difficultyItems[0];

  agInit(params: ICellRendererParams<any, any, any>): void {
    switch (params.value) {
      case 0:
        this.curDifficultyItem = this.difficultyItems[0];
        break;
      case 1:
        this.curDifficultyItem = this.difficultyItems[1];
        break;
      case 2:
        this.curDifficultyItem = this.difficultyItems[2];
        break;
      default:
        this.curDifficultyItem = this.difficultyItems[0];
        break;
    }
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return false;
  }
}

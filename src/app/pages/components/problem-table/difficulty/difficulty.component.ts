import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Difficulty } from '@app/enums/problem';
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
      value: Difficulty.Easy,
      class: 'text-green',
    },
    {
      label: 'Medium',
      value: Difficulty.Medium,
      class: 'text-orange',
    },
    {
      label: 'Hard',
      value: Difficulty.Hard,
      class: 'text-red',
    },
  ];

  protected curDifficultyItem: BadgeItem = this.difficultyItems[0];

  agInit(params: ICellRendererParams<any, any, any>): void {
    switch (params.value as Difficulty) {
      case Difficulty.Easy:
        this.curDifficultyItem = this.difficultyItems[0];
        break;
      case Difficulty.Medium:
        this.curDifficultyItem = this.difficultyItems[1];
        break;
      case Difficulty.Hard:
        this.curDifficultyItem = this.difficultyItems[2];
        break;
    }
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return false;
  }
}

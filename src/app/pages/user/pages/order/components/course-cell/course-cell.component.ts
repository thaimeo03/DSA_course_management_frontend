import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CourseOrderHistory } from '@app/models/payment';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-course-cell',
  imports: [CommonModule],
  templateUrl: './course-cell.component.html',
  styleUrl: './course-cell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseCellComponent implements ICellRendererAngularComp {
  protected courseOrder: CourseOrderHistory | null = null;

  agInit(params: ICellRendererParams<any, any, any>): void {
    this.courseOrder = params.data['course'];
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return false;
  }
}

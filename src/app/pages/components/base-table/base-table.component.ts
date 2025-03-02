import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import { BidvLoaderModule, BidvSvgModule } from '@bidv-ui/core';
import { BidvPaginationSelectPageModule } from '@bidv-ui/kit';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'base-table',
  standalone: true,
  imports: [
    CommonModule,
    AgGridAngular,
    BidvPaginationSelectPageModule,
    BidvLoaderModule,
    BidvSvgModule,
  ],
  templateUrl: './base-table.component.html',
  styleUrls: ['./base-table.component.scss'],
})
export class BaseTableComponent {
  @Input() colDefs: ColDef[] | null = null;
  @Input() defaultColDef: ColDef = {
    suppressMovable: true,
    resizable: false,
    sortable: false,
    unSortIcon: true,
  };
  @Input() gridOptions: GridOptions = {};
  @Input() rowData: any[] = [];
  @Input() rowHeight = 50;
  @Input() hidePagination = false;

  @Input() itemPages: Array<{ value: number; label: string }> = [
    { value: 10, label: '10 /Trang' },
    { value: 20, label: '20 /Trang' },
    { value: 50, label: '50 /Trang' },
    { value: 100, label: '100 /Trang' },
  ];

  protected index = 0;
  protected itemPerPages = 10;
  protected length = 0;

  protected goToPage(index: number): void {
    this.index = index;
  }

  protected selectPage(value: any): void {
    this.index = value;
  }
}

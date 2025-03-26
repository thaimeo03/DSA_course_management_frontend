import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'campaign-no-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss'],
})
export class NoDataComponent {
  @Input() iconUrl = '';
  @Input() title = '';
  @Input() description = '';
  @Input() containerStyle: { [key: string]: string } = {};
}

import { Component } from '@angular/core';
import { CourseListComponent } from './components/course-list/course-list.component';
import { SortingComponent } from './components/sorting/sorting.component';

@Component({
  selector: 'app-home',
  imports: [CourseListComponent, SortingComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}

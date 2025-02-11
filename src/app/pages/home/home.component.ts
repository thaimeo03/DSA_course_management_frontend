import { Component } from '@angular/core';
import { MainLayoutComponent } from '../components/main-layout/main-layout.component';

@Component({
  selector: 'app-home',
  imports: [MainLayoutComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}

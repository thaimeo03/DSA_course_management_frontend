import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BidvRootModule } from '@bidv-ui/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BidvRootModule],
  template: `
    <bidv-root>
      <!-- content of your app -->
      <router-outlet></router-outlet>

      <!--
     If you need, you can add something between Bidv portal layers:
    -->
      <ng-container ngProjectAs="bidvOverContent">
        <!-- Content over app content -->
      </ng-container>
      <ng-container ngProjectAs="bidvOverDialogs">
        <!-- Content over dialogs -->
      </ng-container>
      <ng-container ngProjectAs="bidvOverAlerts">
        <!-- Content over alerts -->
      </ng-container>
      <ng-container ngProjectAs="bidvOverDropdowns">
        <!-- Content over dropdowns -->
      </ng-container>
      <ng-container ngProjectAs="bidvOverHints">
        <!-- Content over hints -->
      </ng-container>
    </bidv-root>
  `,
})
export class AppComponent {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FsPopoverComponent } from './components/popover/popover.component';
import { FsPopoverWrapperComponent } from './components/popover-wrapper/popover-wrapper.component';


@NgModule({
  imports: [
    CommonModule,
    PortalModule,
    MatProgressSpinnerModule,
  ],
  declarations: [
    FsPopoverComponent,
    FsPopoverWrapperComponent,
  ],
  exports: [
    FsPopoverComponent,
  ],
})
export class FsPopoverModule {}

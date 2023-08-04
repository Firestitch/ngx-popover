import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';

import { FsPopoverComponent } from './components/popover/popover.component';
import { FsPopoverWrapperComponent } from './components/popover-wrapper/popover-wrapper.component';
import { FsPopoverDirective } from './directives/popover.directive';


@NgModule({
  imports: [
    CommonModule,
    PortalModule,
  ],
  declarations: [
    FsPopoverComponent,
    FsPopoverWrapperComponent,
    FsPopoverDirective,
  ],
  exports: [
    FsPopoverComponent,
    FsPopoverDirective,
  ],
})
export class FsPopoverModule {}

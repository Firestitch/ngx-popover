import { NgModule } from '@angular/core';

import { FsPopoverComponent } from './components/popover/popover.component';
import { FsPopoverDirective } from './directives/popover.directive';


@NgModule({
  imports: [
    FsPopoverComponent,
    FsPopoverDirective,
  ],
  exports: [
    FsPopoverComponent,
    FsPopoverDirective,
  ],
})
export class FsPopoverModule {}

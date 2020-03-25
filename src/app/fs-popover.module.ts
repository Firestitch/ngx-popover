import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FsPopoverComponent } from './components/popover/popover.component';


@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    FsPopoverComponent,
  ],
  declarations: [
    FsPopoverComponent,
  ],
  providers: [
    // FsComponentService,
  ],
})
export class FsPopoverModule {
  static forRoot(): ModuleWithProviders<FsPopoverModule> {
    return {
      ngModule: FsPopoverModule,
      // providers: [FsComponentService]
    };
  }
}

import { Component, Input } from '@angular/core';
import { FsPopoverRef } from '@firestitch/popover';
import { FsSkeletonModule } from '@firestitch/skeleton';

@Component({
    selector: 'app-popover-content',
    templateUrl: './popover-content.component.html',
    standalone: true,
    imports: [FsSkeletonModule],
})
export class PopoverContentComponent {

  @Input() data;
  @Input() popover: FsPopoverRef;

  public loaded = false;

  constructor() {
    setTimeout(() => {
      this.loaded = true;
      this.popover.show();
    }, 500);
  }
}

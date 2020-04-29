import { Component, Input } from '@angular/core';
import { FsPopoverRef } from '@firestitch/popover';

@Component({
  selector: 'app-popover-content',
  templateUrl: './popover-content.component.html',
})
export class PopoverContentComponent {

  @Input() data;
  @Input() popover: FsPopoverRef;

  public loaded = false;

  constructor() {
    setTimeout(() => {
      this.popover.show();

      setTimeout(() => {

        this.loaded = true;
        setTimeout(() => {
          this.popover.updatePosition();
        });

      }, 500);
    }, 1000);
  }
}

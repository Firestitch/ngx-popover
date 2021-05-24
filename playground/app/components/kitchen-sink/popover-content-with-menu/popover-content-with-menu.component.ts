import { Component, Input } from '@angular/core';
import { FsPopoverRef } from '@firestitch/popover';

@Component({
  selector: 'app-popover-content-with-menu',
  templateUrl: './popover-content-with-menu.component.html',
})
export class PopoverContentWithMenuComponent {

  @Input() data;
  @Input() popover: FsPopoverRef;

  public loaded = false;

  constructor() {
    setTimeout(() => {
      this.loaded = true;
      this.popover.show();
    }, 500);
  }

  public menuOpened() {
    this.popover.autoClose = false;
  }

  public menuClosed() {
    this.popover.autoClose = true;
  }
}

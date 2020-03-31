import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-popover-content',
  templateUrl: './popover-content.component.html',
})
export class PopoverContentComponent {

  @Input() data;

  public loaded = false;

  constructor() {
    setTimeout(() => {
      this.loaded = true
    }, 300);
  }
}

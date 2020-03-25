import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  selector: 'fs-popover',
  templateUrl: 'popover.component.html',
  styleUrls: [ 'popover.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsPopoverComponent {

  constructor() {
  }
}

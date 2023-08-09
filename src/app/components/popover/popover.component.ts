import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FsPopoverDirective } from '../../directives/popover.directive';


@Component({
  selector: 'fs-popover',
  templateUrl: 'popover.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'fs-popover-component',
  }
})
export class FsPopoverComponent extends FsPopoverDirective {}

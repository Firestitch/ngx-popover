import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FsPopoverDirective } from '../../directives/popover.directive';


@Component({
  selector: 'fs-popover',
  templateUrl: 'popover.component.html',
  styleUrls: [ 'popover.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FsPopoverComponent extends FsPopoverDirective {}

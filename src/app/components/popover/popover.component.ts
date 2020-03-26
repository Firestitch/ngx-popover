import {
  ChangeDetectionStrategy,
  Component, ElementRef, HostListener,
  Input,
  TemplateRef,
} from '@angular/core';
import { FsPopoverService } from '../../services/popover.service';


@Component({
  selector: 'fs-popover',
  templateUrl: 'popover.component.html',
  styleUrls: [ 'popover.component.scss' ],
  providers: [
    FsPopoverService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FsPopoverComponent {

  @Input()
  public template: TemplateRef<any>;

  @HostListener('click')
  public tmpClick() {
    this.popoverService.openPopover(this._elRef, this.template);
  }

  constructor(
    private _elRef: ElementRef,
    private popoverService: FsPopoverService,
  ) {}
}

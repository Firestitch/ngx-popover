import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FsPopoverDirective } from '../../directives/popover.directive';
import { NgClass } from '@angular/common';


@Component({
    selector: 'fs-popover',
    templateUrl: 'popover.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'class': 'fs-popover-component',
    },
    standalone: true,
    imports: [NgClass]
})
export class FsPopoverComponent extends FsPopoverDirective {}

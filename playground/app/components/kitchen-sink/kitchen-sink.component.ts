import { Component } from '@angular/core';
import { Position } from './../../../../src/app/enums/position';
import { PopoverContentComponent } from './popover-content/popover-content.component';
import { PopoverContentWithMenuComponent } from './popover-content-with-menu/popover-content-with-menu.component';
import { MatButton } from '@angular/material/button';
import { FsPopoverDirective } from '../../../../src/app/directives/popover.directive';
import { MatFormField } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';

@Component({
    selector: 'kitchen-sink',
    templateUrl: 'kitchen-sink.component.html',
    styleUrls: ['kitchen-sink.component.scss'],
    standalone: true,
    imports: [PopoverContentComponent, PopoverContentWithMenuComponent, MatButton, FsPopoverDirective, MatFormField, MatSelect, FormsModule, MatOption]
})
export class KitchenSinkComponent {

  public config = {};

  public position = Position.South;
  public positions = [
    { name: 'North', value: Position.North },
    { name: 'South', value: Position.South },
    { name: 'East', value: Position.East },
    { name: 'West', value: Position.West }
  ];

  public account = {
    name: 'John',
    email: 'email@email.com'
  };

}

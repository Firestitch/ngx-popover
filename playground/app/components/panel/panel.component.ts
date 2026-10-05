import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';

import { FsDatePickerModule } from '@firestitch/datepicker';

import { FsPopoverRef } from '../../../../src/app/class/popover-ref';
import { FsPopoverDirective } from '../../../../src/app/directives/popover.directive';


interface PanelValues {
  name: string;
  from: Date;
  status: string;
}

@Component({
  selector: 'panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    FsDatePickerModule,
    FsPopoverDirective,
  ],
})
export class PanelComponent {

  public name = signal('');
  public from = signal<Date>(null);
  public status = signal('open');
  public applied = signal<PanelValues>(null);
  public closedCount = signal(0);
  public statuses = [
    { name: 'Open', value: 'open' },
    { name: 'Closed', value: 'closed' },
    { name: 'On hold', value: 'hold' },
  ];

  public apply(popover: FsPopoverRef): void {
    this.applied.set({
      name: this.name(),
      from: this.from(),
      status: this.status(),
    });

    popover.close();
  }

  public panelClosed(): void {
    this.closedCount.update((count) => count + 1);
  }

}

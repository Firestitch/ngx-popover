import { Position } from './../../../../src/app/enums/position';
import { Component } from '@angular/core';
import { KitchenSinkConfigureComponent } from '../kitchen-sink-configure';
import { FsExampleComponent } from '@firestitch/example';
import { FsMessage } from '@firestitch/message';

@Component({
  selector: 'kitchen-sink',
  templateUrl: 'kitchen-sink.component.html',
  styleUrls: ['kitchen-sink.component.scss']
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

  constructor(private exampleComponent: FsExampleComponent,
              private message: FsMessage) {
    exampleComponent.setConfigureComponent(KitchenSinkConfigureComponent, { config: this.config });
  }
}

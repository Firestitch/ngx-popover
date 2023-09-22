import { Component } from '@angular/core';
import { Position } from './../../../../src/app/enums/position';

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

}

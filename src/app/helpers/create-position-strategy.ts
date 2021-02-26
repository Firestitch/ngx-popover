import { ElementRef } from '@angular/core';
import { FlexibleConnectedPositionStrategy, Overlay, PositionStrategy } from '@angular/cdk/overlay';
import { Position } from './../enums/position';


export function createPopupPositionStrategy(el: ElementRef, overlay: Overlay, position: Position): PositionStrategy {

  let overlayX: 'start' | 'center' | 'end' = 'center';
  let overlayY: 'top' | 'center' | 'bottom' = 'center';

  let originX: 'start' | 'center' | 'end' = 'center';
  let originY: 'top' | 'center' | 'bottom' = 'center';

  let offsetX = 0;
  let offsetY = 0;

  let panelClass: string[] = [];


    switch (position) {
    case Position.North:
      originY = 'top';
      overlayY = 'bottom';
      panelClass = ['fs-popover-top'];
      offsetY = -8;
      break;
    case Position.South:
      originY = 'bottom';
      overlayY = 'top';
      panelClass = ['fs-popover-bottom'];
      offsetY = 8;
      break;
    case Position.East:
      overlayX = 'start';
      originX = 'end';
      panelClass = ['fs-popover-left'];
      offsetX = 8;
      break;
    case Position.West:
      overlayX = 'end';
      originX = 'start';
      panelClass = ['fs-popover-right'];
      offsetX = -8;
      break;
  }

  return createBasePopupPositionStrategy(el, overlay)
    .withPositions([
      {
        originX: originX,
        originY: originY,
        overlayX: overlayX,
        overlayY: overlayY,
        offsetX: offsetX,
        offsetY: offsetY,
        panelClass: panelClass,
      }
    ]);
}


function createBasePopupPositionStrategy(el: ElementRef, overlay: Overlay): FlexibleConnectedPositionStrategy {
  return overlay.position()
    .flexibleConnectedTo(el)
    .withGrowAfterOpen(true)
    .withFlexibleDimensions(false)
    .withViewportMargin(4);
}

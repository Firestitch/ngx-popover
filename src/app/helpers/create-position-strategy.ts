import { ElementRef } from '@angular/core';
import { FlexibleConnectedPositionStrategy, Overlay, PositionStrategy } from '@angular/cdk/overlay';
import { Position } from './../enums/position';


export function createPopupPositionStrategy(el: ElementRef, overlay: Overlay, position: Position): PositionStrategy {

  let overlayY: any = 'center';
  let overlayX: any = 'center';

  let originY: any = 'center';
  let originX: any = 'center';

  switch (position) {
    case Position.North:
      originY = 'top';
      overlayY = 'bottom';
      break;
    case Position.South:
      originY = 'bottom';
      overlayY = 'top';
      break;
    case Position.East:
      overlayX = 'start';
      originX = 'end';
      break;
    case Position.West:
      overlayX = 'end';
      originX = 'start';
      break;
  }

  return createBasePopupPositionStrategy(el, overlay)
    .withPositions([
      {
        originX: originX,
        originY: originY,
        overlayX: overlayX,
        overlayY: overlayY,
        offsetY: 0,
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

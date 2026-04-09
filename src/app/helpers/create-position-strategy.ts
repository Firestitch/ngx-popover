import { ElementRef } from '@angular/core';
import { ConnectedPosition, FlexibleConnectedPositionStrategy, Overlay, PositionStrategy } from '@angular/cdk/overlay';
import { Position } from './../enums/position';


const POSITIONS: Record<Position, ConnectedPosition> = {
  [Position.North]: {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom',
    offsetX: 0,
    offsetY: -8,
    panelClass: ['fs-popover-top'],
  },
  [Position.South]: {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
    offsetX: 0,
    offsetY: 8,
    panelClass: ['fs-popover-bottom'],
  },
  [Position.East]: {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
    offsetX: 8,
    offsetY: 0,
    panelClass: ['fs-popover-left'],
  },
  [Position.West]: {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center',
    offsetX: -8,
    offsetY: 0,
    panelClass: ['fs-popover-right'],
  },
};

const FALLBACKS: Record<Position, Position> = {
  [Position.South]: Position.North,
  [Position.North]: Position.South,
  [Position.East]: Position.West,
  [Position.West]: Position.East,
};

export function createPopupPositionStrategy(el: ElementRef, overlay: Overlay, position: Position): PositionStrategy {
  const primary = POSITIONS[position];
  const fallback = POSITIONS[FALLBACKS[position]];

  return createBasePopupPositionStrategy(el, overlay)
    .withPositions([primary, fallback]);
}


function createBasePopupPositionStrategy(el: ElementRef, overlay: Overlay): FlexibleConnectedPositionStrategy {
  return overlay.position()
    .flexibleConnectedTo(el)
    .withGrowAfterOpen(true)
    .withPush(true)
    .withFlexibleDimensions(false)
    .withViewportMargin(4);
}

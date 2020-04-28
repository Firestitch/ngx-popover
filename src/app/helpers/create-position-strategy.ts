import { ElementRef } from '@angular/core';
import { FlexibleConnectedPositionStrategy, Overlay, PositionStrategy } from '@angular/cdk/overlay';

export function createPopupPositionStrategy(el: ElementRef, overlay: Overlay): PositionStrategy {
  return createBasePopupPositionStrategy(el, overlay)
    .withPositions([
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
        offsetY: 0,
      },
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom',
        offsetY: 0,
      }
    ]);
}


function createBasePopupPositionStrategy(el: ElementRef, overlay: Overlay): FlexibleConnectedPositionStrategy {
  return overlay.position()
    .flexibleConnectedTo(el)
    .withGrowAfterOpen(true)
    .withFlexibleDimensions(false)
    .withViewportMargin(8)
    .withLockedPosition();
}

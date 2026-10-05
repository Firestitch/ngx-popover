import { ElementRef } from '@angular/core';

import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';

import { Position } from './../enums/position';
import { createPopupPositionStrategy } from './create-position-strategy';


/**
 * Hover and click popovers have no backdrop. A panel gets a transparent backdrop, so a click
 * anywhere outside it closes it, and the `fs-popover-panel` class on its pane.
 */
export function createOverlayRef(
  el: ElementRef,
  overlay: Overlay,
  position: Position,
  panel = false,
): OverlayRef {
  const overlayConfig = new OverlayConfig({
    positionStrategy: createPopupPositionStrategy(el, overlay, position),
    scrollStrategy: overlay.scrollStrategies.reposition(),
    hasBackdrop: panel,
    backdropClass: panel ? 'cdk-overlay-transparent-backdrop' : undefined,
    panelClass: panel ? 'fs-popover-panel' : undefined,
  });

  return overlay.create(overlayConfig);
}

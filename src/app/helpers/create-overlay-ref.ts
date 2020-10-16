import { ElementRef } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { createPopupPositionStrategy } from './create-position-strategy';
import { Position } from './../enums/position';


export function createOverlayRef(el: ElementRef, overlay: Overlay, position: Position) {
  const config = {
    positionStrategy: createPopupPositionStrategy(el, overlay, position),
    scrollStrategy: overlay.scrollStrategies.close(),
    hasBackdrop: false
  };

  const overlayConfig = new OverlayConfig(config);

  return overlay.create(overlayConfig);
}

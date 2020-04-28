import { ElementRef } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { createPopupPositionStrategy } from './create-position-strategy';


export function createOverlayRef(el: ElementRef, overlay: Overlay) {
  const config = {
    positionStrategy: createPopupPositionStrategy(el, overlay),
    scrollStrategy: overlay.scrollStrategies.reposition(),
    hasBackdrop: false
  };

  const overlayConfig = new OverlayConfig(config);

  return overlay.create(overlayConfig);
}

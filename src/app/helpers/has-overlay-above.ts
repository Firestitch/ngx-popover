import { OverlayRef } from '@angular/cdk/overlay';


/**
 * True when an overlay with a backdrop was attached after this one and still shows content:
 * a calendar, a select, a menu or a dialog opened from inside it. Overlays without a backdrop
 * (tooltips, toasts, hover popovers) don't count.
 *
 * CDK inserts each backdrop right before its overlay's host, and later overlays after earlier
 * ones, so everything after this overlay's host was attached later.
 */
export function hasOverlayAbove(overlayRef: OverlayRef): boolean {
  let element = overlayRef.hostElement?.nextElementSibling;

  while (element) {
    if (isShowingBackdropOverlay(element)) {
      return true;
    }

    element = element.nextElementSibling;
  }

  return false;
}

function isShowingBackdropOverlay(host: Element): boolean {
  const pane = host.querySelector(':scope > .cdk-overlay-pane');

  return !!pane?.childElementCount
    && !!host.previousElementSibling?.classList.contains('cdk-overlay-backdrop');
}

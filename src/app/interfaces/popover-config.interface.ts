import { OverlayRef } from '@angular/cdk/overlay';
import { FsPopoverRef } from '../class/popover-ref';

export interface IPopoverConfig {
  maxWidth?: number;
  wrapperClass?: string;
  autoShow?: boolean;
  diameter?: number;
}

export interface IPopoverActiveElement {
  overlayRef: OverlayRef;
  popoverRef: FsPopoverRef;
}

import { OverlayRef } from '@angular/cdk/overlay';
import { FsPopoverRef } from '../class/popover-ref';

export interface IPopoverConfig {
  maxWidth?: number;
  wrapperClass?: string;
  autoShow?: boolean;
  loadingDiameter?: number;
  loading?: boolean;
}

export interface IPopoverActiveElement {
  overlayRef: OverlayRef;
  popoverRef: FsPopoverRef;
}

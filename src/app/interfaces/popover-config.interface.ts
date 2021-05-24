import { OverlayRef } from '@angular/cdk/overlay';
import { FsPopoverRef } from '../class/popover-ref';

export interface IPopoverConfig {
  maxWidth?: number;
  wrapperClass?: string;
  autoShow?: boolean;
  autoClose?: boolean;
  loadingDiameter?: number;
  loading?: boolean;
  theme?: string;
  size?: string;
}

export interface IPopoverActiveElement {
  overlayRef: OverlayRef;
  popoverRef: FsPopoverRef;
}

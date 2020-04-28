import { Injector } from '@angular/core';
import { PortalInjector } from '@angular/cdk/portal';
import { FsPopoverRef } from '../class/popover-ref';


export function createInjector(popoverRef: FsPopoverRef, parentInjector: Injector) {
  const injectionTokens = new WeakMap<any, any>([
    [FsPopoverRef, popoverRef],
  ]);

  return new PortalInjector(parentInjector, injectionTokens);
}

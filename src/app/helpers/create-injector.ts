import { Injector, StaticProvider } from '@angular/core';

import { FsPopoverRef } from '../class/popover-ref';

export function createInjector(popoverRef: FsPopoverRef, parentInjector: Injector): Injector {
  const providers: StaticProvider[] = [
    { provide: FsPopoverRef, useValue: popoverRef },
  ];

  return Injector.create({
    providers,
    parent: parentInjector,
  });
}

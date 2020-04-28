import { TemplateRef } from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';
import { FsPopoverRef } from '../class/popover-ref';


export function createTempatePortal(template: TemplateRef<any>, popoverRef: FsPopoverRef, data: any) {
  return new TemplatePortal(
    template,
    void 0,
    { data: data, popover: popoverRef },
  );
}

import { ElementRef, Injectable, Injector, TemplateRef } from '@angular/core';

import {
  ComponentType,
  Overlay,
  OverlayRef,
} from '@angular/cdk/overlay';

import { ComponentPortal } from '@angular/cdk/portal';

import { FsPopoverRef } from '../class/popover-ref';
import { FsPopoverWrapperComponent } from '../components/popover-wrapper/popover-wrapper.component';
import { createOverlayRef } from '../helpers/create-overlay-ref';
import { createInjector } from '../helpers/create-injector';
import { createTempatePortal } from '../helpers/create-template-portal';
import { IPopoverActiveElement } from '../interfaces/popover-config.interface';


@Injectable()
export class FsPopoverService {

  private _activeElement: IPopoverActiveElement;

  constructor(
    private _injector: Injector,
    private _overlay: Overlay,
  ) {}

  public get hasActivePopover() {
    return !!this._activeElement;
  }

  public openPopover(
    el: ElementRef,
    template: TemplateRef<any>,
    data: any,
    popoverRef: FsPopoverRef,
  ) {

    if (this._activeElement) {
      this.close(this._activeElement.popoverRef)
    }

    const overlayRef = createOverlayRef(el, this._overlay);

    const containerRef = this._openPortalPreview(FsPopoverWrapperComponent, overlayRef, popoverRef);
    const templatePortal = createTempatePortal(template, popoverRef, data);
    containerRef.instance.attachTemplatePortal(templatePortal);

    this._activeElement = {
      overlayRef,
      popoverRef,
    };

    return containerRef.location.nativeElement;
  }

  public close(popoverRef = null) {
    if (this._activeElement.popoverRef === popoverRef) {
      this._activeElement.overlayRef.detach();
      this._activeElement = void 0;
    }
  }

  private _openPortalPreview(
    component: ComponentType<FsPopoverWrapperComponent>,
    overlayRef: OverlayRef,
    popoverRef: FsPopoverRef,
  ) {
    const containerPortal = new ComponentPortal<FsPopoverWrapperComponent>(
      component,
      void 0,
      createInjector(popoverRef, this._injector),
    );

    return overlayRef.attach(containerPortal);
  }
}

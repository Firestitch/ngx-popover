import { ElementRef, Injectable, Injector, TemplateRef } from '@angular/core';

import {
  ComponentType,
  Overlay,
  OverlayRef,
} from '@angular/cdk/overlay';

import { ComponentPortal } from '@angular/cdk/portal';

import { Position } from './../enums/position';
import { FsPopoverRef } from '../class/popover-ref';
import { FsPopoverWrapperComponent } from '../components/popover-wrapper/popover-wrapper.component';
import { createOverlayRef } from '../helpers/create-overlay-ref';
import { createInjector } from '../helpers/create-injector';
import { createTempatePortal } from '../helpers/create-template-portal';
import { IPopoverActiveElement } from '../interfaces/popover-config.interface';


@Injectable({
  providedIn: 'root',
})
export class FsPopoverService {

  private _activeElement: IPopoverActiveElement;
  private _activeElementGUID: string;

  constructor(
    private _injector: Injector,
    private _overlay: Overlay,
  ) {}

  public get hasActivePopover() {
    return !!this._activeElement;
  }

  public get activeElementGUID(): string {
    return this._activeElementGUID;
  }

  public setActivePopoverGUID(value: string) {
    this._activeElementGUID = value;
  }

  public openPopover(
    el: ElementRef,
    text: string,
    data: any,
    popoverRef: FsPopoverRef,
    position: Position
  ): Element;

  public openPopover(
    el: ElementRef,
    template: TemplateRef<any>,
    data: any,
    popoverRef: FsPopoverRef,
    position: Position
  ): Element;

  public openPopover(
    el: ElementRef,
    content: TemplateRef<any> | string,
    data: any,
    popoverRef: FsPopoverRef,
    position: Position
  ): Element {

    if (this._activeElement) {
      this.close(this._activeElement.popoverRef)
    }

    const overlayRef = createOverlayRef(el, this._overlay, position);
    const containerRef = this._openPortalPreview(FsPopoverWrapperComponent, overlayRef, popoverRef);

    if (content instanceof TemplateRef) {
      const templatePortal = createTempatePortal(content, popoverRef, data);

      containerRef.instance.attachTemplatePortal(templatePortal);
    } else {
      containerRef.instance.setTextualContent(content);
    }

    popoverRef.overlayRef = overlayRef;

    this._activeElement = {
      overlayRef,
      popoverRef,
    };

    return containerRef.location.nativeElement;
  }

  public close(popoverRef: FsPopoverRef = null) {
    if (this._activeElement.popoverRef === popoverRef) {
      popoverRef.close();
      this._activeElement = void 0;
      this._activeElementGUID = void 0;
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

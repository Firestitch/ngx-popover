import { ComponentRef, ElementRef, Injectable, Injector, TemplateRef } from '@angular/core';

import {
  ComponentType,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig, OverlayRef,
  PositionStrategy
} from '@angular/cdk/overlay';

import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';

import { FsPopoverWrapperComponent } from '../components/popover-wrapper/popover-wrapper.component';


@Injectable()
export class FsPopoverService {

  private _overlayRef: OverlayRef;
  private _containerRef: ComponentRef<any>;
  private _opened = false;

  constructor(
    private _injector: Injector,
    private _overlay: Overlay,
  ) {}

  public get wrapperElement() {
    return this._containerRef.location.nativeElement;
  }

  public openPopover(
    el: ElementRef,
    template: TemplateRef<any>,
    data: any,
    width?: number,
    wrapperClass?: string,
  ) {

    if (this._opened) {
      return;
    }

    this._opened = true;
    this._overlayRef = this._createOverlay(el);
    const templatePortal = this._createTempatePortal(template, data);
    this._containerRef = this._openPortalPreview(FsPopoverWrapperComponent, this._overlayRef);

    this._containerRef.instance.attachTemplatePortal(templatePortal);
    this._containerRef.instance.width = width;
    this._containerRef.instance.wrapperClass = wrapperClass;
  }

  public close() {
    this._containerRef.destroy();
    this._overlayRef.detach();
    this._opened = false;
  }

  private _openPortalPreview(
    component: ComponentType<FsPopoverWrapperComponent>,
    overlayRef: OverlayRef,
  ) {
    const containerPortal = new ComponentPortal<FsPopoverWrapperComponent>(
      component,
      void 0,
      this._injector
    );

    return overlayRef.attach(containerPortal);
  }

  private _createOverlay(el: ElementRef, config = {}) {
    config = Object.assign(
      {
        positionStrategy: this._createPopupPositionStrategy(el),
        scrollStrategy: this._overlay.scrollStrategies.reposition(),
        hasBackdrop: false
      }, config);

    const overlayConfig = new OverlayConfig(config);

    return this._overlay.create(overlayConfig);
  }

  private _createTempatePortal(template: TemplateRef<any>, data: any) {
    return new TemplatePortal(template, void 0, data);
  }

  private _createPopupPositionStrategy(el: ElementRef): PositionStrategy {
    return this._createBasePopupPositionStrategy(el)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 0,
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetY: 0,
        }
      ]);
  }


  private _createBasePopupPositionStrategy(el: ElementRef): FlexibleConnectedPositionStrategy {
    return this._overlay.position()
      .flexibleConnectedTo(el)
      .withGrowAfterOpen(true)
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withLockedPosition()
  }

}

import { ElementRef, Injectable, Injector, TemplateRef } from '@angular/core';

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
  constructor(
    private _injector: Injector,
    private _overlay: Overlay,
  ) {}


  public openPopover(el: ElementRef, template: TemplateRef<any>) {
    const overlayRef = this._createOverlay(el);
    const templatePortal = this._createTempatePortal(template);

    const containerRef = this._openPortalPreview(FsPopoverWrapperComponent, overlayRef);

    containerRef.instance.attachTemplatePortal(templatePortal);
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
        hasBackdrop: true,
        backdropClass: [],
      }, config);

    const overlayConfig = new OverlayConfig(config);

    return this._overlay.create(overlayConfig);
  }

  private _createTempatePortal(template: TemplateRef<any>) {
    return new TemplatePortal(template, void 0);
  }

  private _createPopupPositionStrategy(el: ElementRef): PositionStrategy {
    return this._createBasePopupPositionStrategy(el)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top'
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
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

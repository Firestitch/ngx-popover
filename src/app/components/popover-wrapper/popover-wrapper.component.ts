import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef, ElementRef,
  EmbeddedViewRef,
  ViewChild,
} from '@angular/core';
import {
  BasePortalOutlet,
  CdkPortalOutlet, ComponentPortal,
  TemplatePortal
} from '@angular/cdk/portal';

@Component({
  selector: 'fs-popover-wrapper',
  templateUrl: 'popover-wrapper.component.html',
  styleUrls: [ 'popover-wrapper.component.scss' ],
  host: {
    'class': 'mat-elevation-z4 popover-wrapper',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsPopoverWrapperComponent extends BasePortalOutlet {

  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet: CdkPortalOutlet;

  constructor(private _el: ElementRef) {
    super();
  }

  public set width(value: number) {
    if (value) {
      this._el.nativeElement.style.width = value + 'px';
    } else {
      this._el.nativeElement.style.width = void 0;
    }
  }

  /**
   * Attach a TemplatePortal as content to this popover container.
   * @param portal Portal to be attached as the popover content.
   */
  public attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {

    if (this._portalOutlet.hasAttached()) {
      throw Error('Popover template already attached');
    }

    return this._portalOutlet.attachTemplatePortal(portal);
  }


  /**
   * Attach a ComponentPortal as content to this popover container.
   * @param portal Portal to be attached as the popover content.
   */
  public attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {

    if (this._portalOutlet.hasAttached()) {
      throw Error('Popover component already attached');
    }

    return this._portalOutlet.attachComponentPortal(portal);
  }

}

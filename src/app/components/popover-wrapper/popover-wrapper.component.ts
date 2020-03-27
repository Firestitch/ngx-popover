import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef, ElementRef,
  EmbeddedViewRef,
  ViewChild,
  HostBinding,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsPopoverWrapperComponent extends BasePortalOutlet {

  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet: CdkPortalOutlet;
  @HostBinding('class') class;

  private _wrapperClass;

  constructor(private _el: ElementRef) {
    super();
    this._updateClass();
  }

  public set width(value: number) {
    if (value) {
      this._el.nativeElement.style.width = value + 'px';
    } else {
      this._el.nativeElement.style.width = void 0;
    }
  }

  public set wrapperClass(value: string) {
    this._wrapperClass = value;
    this._updateClass();
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

  private _updateClass() {
    this.class = ['popover-wrapper', this._wrapperClass].filter(Boolean).join(' ');
  }
}

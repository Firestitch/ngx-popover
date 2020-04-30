import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  ViewChild,
  HostBinding,
  OnDestroy, NgZone,
  OnInit,
} from '@angular/core';

import {
  BasePortalOutlet,
  CdkPortalOutlet,
  ComponentPortal,
  TemplatePortal
} from '@angular/cdk/portal';

import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { FsPopoverRef } from '../../class/popover-ref';


@Component({
  selector: 'fs-popover-wrapper',
  templateUrl: 'popover-wrapper.component.html',
  styleUrls: [ 'popover-wrapper.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsPopoverWrapperComponent extends BasePortalOutlet implements OnInit, OnDestroy {

  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet: CdkPortalOutlet;

  @ViewChild('spinner')
  public spinner;

  @HostBinding('class') class;

  public hidden = false;

  private _wrapperClass;
  private _destroy$ = new Subject<void>();

  constructor(
    public popoverRef: FsPopoverRef,
    private _el: ElementRef,
    private _zone: NgZone,
  ) {
    super();
    this._updateClass();

    this.wrapperClass = this.popoverRef.wrapperClass;
    this.maxWidth = this.popoverRef.maxWidth;
  }

  public set maxWidth(value: number) {
    this._el.nativeElement.style.maxWidth = value ? value + 'px' : void 0;
  }

  public set wrapperClass(value: string) {
    this._wrapperClass = value;
    this._updateClass();
  }

  public ngOnInit(): void {
    if (!this.popoverRef.autoShow && this.popoverRef.componentLoading) {
      this._watchMousePosition();
    }
  }


  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
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

  private _watchMousePosition() {
    const componentVisibilityChange$ = this.popoverRef.componentVisible$
      .pipe(
        filter((value) => value === true)
      );

    this._zone.runOutsideAngular(() => {
      fromEvent(document, 'mousemove')
        .pipe(
          takeUntil(componentVisibilityChange$),
          takeUntil(this._destroy$),
        )
        .subscribe((e: MouseEvent) => {
          this.spinner.nativeElement.style.left = e.x + 'px';
          this.spinner.nativeElement.style.top = (e.y + 20) + 'px';
        });
    });
  }

  private _updateClass() {
    this.class = ['popover-wrapper', this._wrapperClass].filter(Boolean).join(' ');
  }
}

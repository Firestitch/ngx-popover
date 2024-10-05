import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  ViewChild,
  OnDestroy,
  NgZone,
  OnInit,
  Renderer2,
} from '@angular/core';

import {
  BasePortalOutlet,
  CdkPortalOutlet,
  ComponentPortal,
  TemplatePortal,
} from '@angular/cdk/portal';

import { fromEvent, Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';

import { FsPopoverRef } from '../../class/popover-ref';


@Component({
  selector: 'fs-popover-wrapper',
  templateUrl: 'popover-wrapper.component.html',
  styleUrls: [ 'popover-wrapper.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'fs-popover-wrapper',
  },
})
export class FsPopoverWrapperComponent extends BasePortalOutlet implements OnInit, OnDestroy {

  @ViewChild(CdkPortalOutlet, { static: true })
  public _portalOutlet: CdkPortalOutlet;

  @ViewChild('spinner')
  public spinner: ElementRef;

  public content: string;

  private _wrapperClass: string;
  private _contentChangesObserver: MutationObserver;
  private _updatePosition = new Subject<void>();

  private _destroy$ = new Subject<void>();

  constructor(
    public popoverRef: FsPopoverRef,
    private _el: ElementRef,
    private _zone: NgZone,
    private _renderer: Renderer2,
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

    this._observeContentChanges();
    this._listenUpdatePositionRequests();
  }


  public ngOnDestroy() {
    this._contentChangesObserver.disconnect();
    this._destroy$.next(null);
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

  public setTextualContent(content: string): void {
    this.content = content;
  }

  public updatePosition() {
    this._updatePosition.next(null);
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
    if (this._wrapperClass) {
      this._renderer.addClass(this._el.nativeElement, this._wrapperClass);
    }
  }

  private _observeContentChanges() {
    const config = {
      childList: true,
      subtree: true
    };

    this._contentChangesObserver = new MutationObserver(() => {
      this.updatePosition();
    });

    this._contentChangesObserver.observe(this._el.nativeElement, config);
  }

  private _listenUpdatePositionRequests() {
    this._updatePosition
      .pipe(
        debounceTime(50),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.popoverRef.updatePosition();
      })
  }
}

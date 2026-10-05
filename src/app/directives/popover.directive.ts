import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  HostBinding,
  Injector,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  booleanAttribute,
  inject,
  input,
  output,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { ConfigurableFocusTrapFactory, FocusTrap } from '@angular/cdk/a11y';
import { hasModifierKey } from '@angular/cdk/keycodes';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { guid } from '@firestitch/common';

import { Observable, Subject, fromEvent, merge, pipe, timer } from 'rxjs';
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  finalize,
  mapTo,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';


import { FsPopoverRef } from '../class/popover-ref';
import { FsPopoverWrapperComponent } from '../components/popover-wrapper/popover-wrapper.component';
import { Position } from '../enums/position';
import { createInjector } from '../helpers/create-injector';
import { createOverlayRef } from '../helpers/create-overlay-ref';
import { createTempatePortal } from '../helpers/create-template-portal';
import { hasOverlayAbove } from '../helpers/has-overlay-above';
import { pointInRect } from '../helpers/point-in-rect';
import { FsPopoverService } from '../services/popover.service';


@Directive({
  selector: '[fsPopover]',
  exportAs: 'fsPopover',
  host: {
    'class': 'fs-popover',
  },
  standalone: true,
})
export class FsPopoverDirective implements OnInit, OnChanges, OnDestroy {

  @Input()
  public text: string;

  @Input()
  public template: TemplateRef<any>;

  @Input()
  public data: any;

  @Input()
  public leaveDelay = 100;

  @Input()
  public showDelay = 0;

  @Input()
  public maxWidth = 250;

  @Input()
  public maxHeight: number;

  @Input()
  public wrapperClass: string;

  @Input()
  public autoShow = true;

  @Input()
  public autoClose = true;

  @Input()
  public loadingDiameter = 20;

  @Input()
  public loading = true;

  @Input()
  @HostBinding('class.indication')
  public indication = true;

  @Input()
  public position: Position = Position.South;

  @Input()
  public theme: 'light' | 'dark' = 'light';

  @Input()
  public size: 'tiny' | 'small' | 'normal' = 'normal';

  @Input()
  public trigger: 'click' | 'mouseover' = 'mouseover';

  @Input()
  @HostBinding('class.fs-popover-enabled')
  public enabled = true;

  /**
   * Panel mode: a host click or open() opens it; it stays open until close(), an outside
   * click, Escape (only when no later overlay with a backdrop sits above it) or `popover.close()`
   * from the content. Focus is trapped inside and returns on close to the element that had it
   * when the panel opened. `trigger`, `showDelay`, `leaveDelay` and `autoClose` don't apply.
   */
  public panel = input(false, { transform: booleanAttribute });

  /**
   * Emits each time the panel closes.
   */
  public closed = output<void>();

  private _initialized = false;

  private _popoverRef: FsPopoverRef;
  private _wrapperElement: Element;
  private _hostBounds: DOMRect;

  private _mouseEnter$: Observable<MouseEvent>;
  private _mouseMove$: Observable<Event>;
  private _mouseLeave$: Observable<MouseEvent>;

  private _popoverClosed$ = new Subject<void>();
  private _destroy$ = new Subject<void>();
  private _elRef = inject(ElementRef);
  private _popoverService = inject(FsPopoverService);
  private _ngZone = inject(NgZone);
  private _router = inject(Router, { optional: true });
  private _guid = guid('xxxxxxx');
  private _overlay = inject(Overlay);
  private _injector = inject(Injector);
  private _focusTrapFactory = inject(ConfigurableFocusTrapFactory);
  private _document = inject(DOCUMENT);
  private _panelOverlayRef: OverlayRef;
  private _panelFocusTrap: FocusTrap;
  private _panelOpener: HTMLElement;
  private _panelTopmostKeydown: KeyboardEvent;
  private _panelClosed$ = new Subject<void>();

  constructor() {
    this._mouseEnter$ = fromEvent(this._elRef.nativeElement, 'mouseenter');
    this._mouseMove$ = fromEvent(document, 'mousemove', { passive: true });
    this._mouseLeave$ = fromEvent(this._elRef.nativeElement, 'mouseleave');
  }

  public get openTimer$(): Observable<number> {
    return timer(this.showDelay);
  }

  public get closeTimer$(): Observable<number> {
    return timer(this.leaveDelay);
  }

  public ngOnInit(): void {
    if (this.enabled) {
      this._initialize();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.enabled?.currentValue !== changes.enabled?.previousValue) {
      if (this.enabled && !this._initialized) {
        this._initialize();
      }
    }
  }

  public ngOnDestroy() {
    if (this._panelOverlayRef) {
      this._finishPanel(false);
    }

    this._popoverClosed$.next(null);
    this._destroy$.next(null);
  }

  /**
   * Opens the panel on this element. Panel mode only.
   */
  public open(): void {
    if (!this.panel() || !this.enabled || !this._initialized || this._panelOverlayRef) {
      return;
    }

    this._ngZone.run(() => this._openPanel());
  }

  /**
   * Closes the panel, or in hover and click modes the open popover.
   */
  public close(): void {
    if (!this.panel()) {
      this._closePopover();

      return;
    }

    if (this._panelOverlayRef) {
      this._ngZone.run(() => this._popoverRef.close());
    }
  }

  private _closePopover() {
    this._popoverClosed$.next(null);

    this._ngZone.run(() => {
      this._wrapperElement = null;

      if (this._popoverService.hasActivePopover) {
        this._popoverService.close(this._popoverRef);
      }
    });
  }

  private _initialize(): void {
    if (this._initialized) {
      return;
    }

    this._popoverRef = new FsPopoverRef({
      maxWidth: this.maxWidth,
      maxHeight: this.maxHeight,
      wrapperClass: this.wrapperClass,
      autoShow: this.autoShow,
      autoClose: this.autoClose,
      loadingDiameter: this.loadingDiameter,
      loading: this.loading,
      size: this.size,
      theme: this.theme,
    });

    this._ngZone.runOutsideAngular(() => {
      if (this.panel()) {
        this._listenPanelHostClick();
      } else if (this.trigger === 'click') {
        this._listenMouseHostClick();
      } else {
        this._listenMouseHostEnter();
      }
    });

    this._listenRouteChange();

    this._initialized = true;
  }

  private _listenRouteChange(): void {
    this._router.events
      .pipe(
        filter((event) => {
          return event instanceof NavigationEnd;
        }),
        pipe(
          takeUntil(
            this._destroy$
              .pipe(delay(200)),
          ),
        ),
      )
      .subscribe(() => {
        this.close();
      });
  }

  private _listenMouseHostClick(): void {
    fromEvent(this._elRef.nativeElement, 'click', { passive: true })
      .pipe(
        filter(() => this.enabled),
        tap((e: MouseEvent) => {
          e.stopPropagation();

          this._openPopover();
        }),
        switchMap(() => this._listenMouseHostLeave$()),
        switchMap(() => this.closeTimer$),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._closePopover();
      });
  }

  private _listenMouseHostEnter(): void {
    const actualMouseState$ = merge(
      this._mouseLeave$.pipe(mapTo(true)),
      this._mouseEnter$.pipe(mapTo(false)),
    )
      .pipe(
        startWith(false),
        distinctUntilChanged(),
      );

    this._mouseEnter$
      .pipe(
        filter(() => this.enabled),
        filter(() => {
          return !this._wrapperElement;
        }),
        tap(() => {
          this._popoverService.setActivePopoverGUID(this._guid);
        }),
        switchMap(() => this.openTimer$),
        // we have to check that after all delays mouse still over an elemen
        withLatestFrom(actualMouseState$),
        filter(([_, mouseLeave]) => {
          return !mouseLeave;
        }),
        tap(() => this._openPopover()),
        switchMap(() => this._listenMouseHostLeave$()),
        switchMap(() => this.closeTimer$),
        tap(() => this._closePopover()),
        finalize(() => this._closePopover()),
        takeUntil(this._destroy$),
      )
      .subscribe();
  }

  private _openPopover(): void {
    if (this.trigger === 'mouseover' && this._popoverService.activeElementGUID !== this._guid) {
      return;
    }

    this._hostBounds = this._elRef.nativeElement.getBoundingClientRect();

    this._ngZone.run(() => {
      this._wrapperElement = this.template ? this._popoverService.openPopover(
        this._elRef,
        this.template,
        this.data,
        this._popoverRef,
        this.position,
      ) : this._popoverService.openPopover(
        this._elRef,
        this.text,
        this.data,
        this._popoverRef,
        this.position,
      );
    });
  }

  private _listenMouseHostLeave$(): Observable<MouseEvent> {
    const mouseMove$ = this._mouseMove$
      .pipe(
        debounceTime(50),
        filter(() => !!this._wrapperElement),
        filter((event: MouseEvent) => {
          return this._popoverRef.autoClose && this._mouseLeftTheTargets(event);
        }),
      );

    const mouseClick$ = fromEvent<MouseEvent>(this._elRef.nativeElement, 'click');

    return merge(
      mouseMove$,
      mouseClick$,
    );
    //
    // return this._mouseLeave$
    //   .pipe(
    //     //
    //     timeoutWith(200, mouseMove$),
    //   );
  }

  // Check if mouse left target or popover rects
  private _mouseLeftTheTargets(event: MouseEvent): boolean {
    const hostBounds = this._hostBounds;
    const popoverBounds = this._wrapperElement.getBoundingClientRect();

    const pointInHostRect = pointInRect(
      hostBounds.x,
      hostBounds.y,
      hostBounds.x + hostBounds.width,
      hostBounds.y + hostBounds.height,
      event.x,
      event.y,
    );

    const pointInPopoverRect = pointInRect(
      popoverBounds.x,
      popoverBounds.y,
      popoverBounds.x + popoverBounds.width,
      popoverBounds.y + popoverBounds.height,
      event.x,
      event.y,
    );

    return !pointInHostRect && !pointInPopoverRect;
  }

  private _listenPanelHostClick(): void {
    fromEvent<MouseEvent>(this._elRef.nativeElement, 'click')
      .pipe(
        filter(() => this.enabled),
        tap((event) => {
          event.stopPropagation();
          this.open();
        }),
        takeUntil(this._destroy$),
      )
      .subscribe();
  }

  private _openPanel(): void {
    this._panelOpener = this._document.activeElement as HTMLElement;
    this._panelOverlayRef = createOverlayRef(this._elRef, this._overlay, this.position, true);
    this._popoverRef.overlayRef = this._panelOverlayRef;

    const wrapperElement = this._attachPanelContent(this._panelOverlayRef);

    this._trapPanelFocus(wrapperElement);
    this._listenPanelClose(this._panelOverlayRef);
    this._listenPanelEscape(this._panelOverlayRef);
  }

  private _attachPanelContent(overlayRef: OverlayRef): HTMLElement {
    const wrapperRef = overlayRef.attach(
      new ComponentPortal(
        FsPopoverWrapperComponent,
        null,
        createInjector(this._popoverRef, this._injector),
      ),
    );

    if (this.template) {
      wrapperRef.instance
        .attachTemplatePortal(createTempatePortal(this.template, this._popoverRef, this.data));
    } else {
      wrapperRef.instance.setTextualContent(this.text);
    }

    return wrapperRef.location.nativeElement;
  }

  /**
   * The configurable trap also pulls focus back when it lands outside the panel, for
   * example on the first Tab after a calendar inside closed and took the focused element
   * with it. Focus inside other overlays (a select, a calendar) is left alone.
   */
  private _trapPanelFocus(wrapperElement: HTMLElement): void {
    this._panelFocusTrap = this._focusTrapFactory.create(wrapperElement);
    this._panelFocusTrap.focusInitialElementWhenReady()
      .then((focused) => {
        // Nothing inside takes focus (text only): the panel itself becomes the one
        // tab stop, so the opener behind the backdrop doesn't keep focus.
        if (!focused && wrapperElement.isConnected) {
          wrapperElement.setAttribute('tabindex', '0');
          wrapperElement.style.outline = 'none';
          wrapperElement.focus();
        }
      });
  }

  private _listenPanelClose(overlayRef: OverlayRef): void {
    overlayRef.backdropClick()
      .pipe(
        tap(() => this.close()),
        takeUntil(this._panelClosed$),
      )
      .subscribe();

    // Every close (close(), the backdrop, Escape, or `popover.close()` from the
    // content) goes through FsPopoverRef.close(), which detaches and then emits.
    this._popoverRef.closed$
      .pipe(
        take(1),
        tap(() => this._finishPanel(true)),
        takeUntil(this._panelClosed$),
      )
      .subscribe();
  }

  /**
   * Escape closes the panel only when no later overlay with a backdrop sits above it, so
   * Escape in a calendar, select or menu opened from the panel closes only that. The check
   * runs in the capture phase, before any handler inside closes its own overlay; fs-datepicker,
   * for one, closes its calendar from the input's keydown and from a document listener.
   */
  private _listenPanelEscape(overlayRef: OverlayRef): void {
    this._ngZone.runOutsideAngular(() => {
      fromEvent<KeyboardEvent>(this._document, 'keydown', { capture: true })
        .pipe(
          tap((event) => {
            this._panelTopmostKeydown = hasOverlayAbove(overlayRef) ? null : event;
          }),
          takeUntil(this._panelClosed$),
        )
        .subscribe();
    });

    overlayRef.keydownEvents()
      .pipe(
        filter((event) => event.key === 'Escape' && !hasModifierKey(event)),
        filter((event) => event === this._panelTopmostKeydown),
        tap(() => this.close()),
        takeUntil(this._panelClosed$),
      )
      .subscribe();
  }

  private _finishPanel(emit: boolean): void {
    const overlayRef = this._panelOverlayRef;

    this._panelOverlayRef = null;
    this._panelTopmostKeydown = null;
    this._panelClosed$.next();
    this._panelFocusTrap?.destroy();
    this._panelFocusTrap = null;
    overlayRef.dispose();
    this._restorePanelFocus();

    if (emit) {
      this.closed.emit();
    }
  }

  private _restorePanelFocus(): void {
    const opener = this._panelOpener;

    this._panelOpener = null;

    if (opener?.isConnected && typeof opener.focus === 'function') {
      opener.focus();
    }
  }
}

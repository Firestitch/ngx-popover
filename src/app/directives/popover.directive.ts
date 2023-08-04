import {
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  TemplateRef,
  HostBinding,
  Directive,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { fromEvent, pipe, Subject, timer, Observable, merge } from 'rxjs';
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  finalize,
  mapTo,
  startWith,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { guid } from '@firestitch/common';

import { Position } from '../enums/position';
import { FsPopoverService } from '../services/popover.service';
import { pointInRect } from '../helpers/point-in-rect';
import { FsPopoverRef } from '../class/popover-ref';


@Directive({
  selector: '[fsPopover]',
})
export class FsPopoverDirective implements OnInit, OnChanges, OnDestroy {

  private _guid = guid('xxxxxxx');

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
  public enabled = true;

  private _initialized = false;

  private _popoverRef: FsPopoverRef;
  private _wrapperElement: Element;
  private _hostBounds: DOMRect;

  private _mouseEnter$ = fromEvent(this._elRef.nativeElement, 'mouseenter');
  private _mouseMove$ = fromEvent(document, 'mousemove', { passive: true });
  private _mouseLeave$ = fromEvent<MouseEvent>(this._elRef.nativeElement, 'mouseleave');

  private _popoverClosed$ = new Subject<void>();
  private _destroy$ = new Subject<void>();

  constructor(
    private _elRef: ElementRef,
    private _popoverService: FsPopoverService,
    private _ngZone: NgZone,
    @Optional() private _router: Router,
  ) {
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
    this._popoverClosed$.next();
    this._destroy$.next();
  }

  private _closePopover() {
    this._popoverClosed$.next();

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
      wrapperClass: this.wrapperClass,
      autoShow: this.autoShow,
      autoClose: this.autoClose,
      loadingDiameter: this.loadingDiameter,
      loading: this.loading,
      size: this.size,
      theme: this.theme,
    });

    this._ngZone.runOutsideAngular(() => {
      if (this.trigger === 'click') {
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
        )
      )
      .subscribe(() => {
        this._closePopover();
      })
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
      if (this.template) {
        this._wrapperElement = this._popoverService.openPopover(
          this._elRef,
          this.template,
          this.data,
          this._popoverRef,
          this.position
        );
      } else {
        this._wrapperElement = this._popoverService.openPopover(
          this._elRef,
          this.text,
          this.data,
          this._popoverRef,
          this.position
        );
      }
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
      event.y
    );

    const pointInPopoverRect = pointInRect(
      popoverBounds.x,
      popoverBounds.y,
      popoverBounds.x + popoverBounds.width,
      popoverBounds.y + popoverBounds.height,
      event.x,
      event.y
    );

    return !pointInHostRect && !pointInPopoverRect;
  }
}

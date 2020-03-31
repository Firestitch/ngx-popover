import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';

import { FsPopoverService } from '../../services/popover.service';
import { pointInRect } from '../../helpers/point-in-rect';


@Component({
  selector: 'fs-popover',
  templateUrl: 'popover.component.html',
  styleUrls: [ 'popover.component.scss' ],
  providers: [
    FsPopoverService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FsPopoverComponent implements OnInit, OnDestroy {

  @Input()
  public template: TemplateRef<any>;

  @Input()
  public data: any;

  @Input()
  public leaveDelay = 100;

  @Input()
  public maxWidth;

  @Input()
  public wrapperClass;

  public closeTimer;

  private _hostBounds: DOMRect;
  private _popoverClosed$ = new Subject<void>();
  private _destroy$ = new Subject<void>();

  constructor(
    private _elRef: ElementRef,
    private _popoverService: FsPopoverService,
    private _ngZone: NgZone,
  ) {
  }

  public ngOnInit() {
    this._ngZone.runOutsideAngular(() => {
      this._listenMouseHostEnter();
    });
  }

  public ngOnDestroy() {
    this._popoverClosed$.next();
    this._destroy$.next();
  }

  private _closePopover() {
    this._popoverClosed$.next();

    this._ngZone.run(() => {
      this._popoverService.close();
    });
  }

  private _startCloseTimer() {
    this.closeTimer = setTimeout(() => {
      this._closePopover();
    }, this.leaveDelay);
  }

  private _clearCloseTimer() {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = void 0;
    }
  }

  private _listenMouseHostEnter() {
    fromEvent(this._elRef.nativeElement, 'mouseenter', { passive: true })
      .pipe(
        tap(() => this._openPopover()),
        switchMap(() => this._listenMouseHostLeave()),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._startCloseTimer();
      })
  }

  private _openPopover() {
    this._clearCloseTimer();
    this._hostBounds = this._elRef.nativeElement.getBoundingClientRect();

    this._ngZone.run(() => {
      this._popoverService.openPopover(
        this._elRef,
        this.template,
        this.data,
        this.maxWidth,
        this.wrapperClass
      );
    });
  }

  private _listenMouseHostLeave() {
    return fromEvent(document, 'mousemove', { passive: true })
      .pipe(
        tap(() => {
          this._clearCloseTimer();
        }),
        filter((event: MouseEvent) => {
          return this._mouseLeftTheTargets(event)
        }),
        takeUntil(this._popoverClosed$),
      )
  }

  // Check if mouse left target or popover rects
  private _mouseLeftTheTargets(event: MouseEvent) {
    const hostBounds = this._hostBounds;
    const popoverBounds = this._popoverService.wrapperElement.getBoundingClientRect();

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

    return !(pointInHostRect || pointInPopoverRect)
  }
}

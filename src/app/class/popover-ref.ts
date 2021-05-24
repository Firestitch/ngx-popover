import { OverlayRef } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { IPopoverConfig } from '../interfaces/popover-config.interface';


@Injectable()
export class FsPopoverRef {

  public overlayRef: OverlayRef;

  private readonly _autoShow$ = new BehaviorSubject<boolean>(true);
  private readonly _autoClose$ = new BehaviorSubject<boolean>(true);
  private readonly _componentLoading$ = new BehaviorSubject<boolean>(true);
  private _maxWidth: number;
  private _wrapperClass: string;
  private _loadingDiameter: number;
  private _loading: boolean;
  private _theme: string;
  private _size: string;

  constructor(config: IPopoverConfig = {}) {
    this._init(config);
  }

  public get loadingDiameter() {
    return this._loadingDiameter;
  }

  public get size() {
    return this._size;
  }

  public get theme() {
    return this._theme;
  }

  public get loading() {
    return this._loading;
  }

  public get autoShow$() {
    return this._autoShow$.asObservable();
  }

  public get autoShow() {
    return this._autoShow$.getValue();
  }

  public set autoShow(value: boolean) {
    this._autoShow$.next(value);
  }

  public get autoClose$() {
    return this._autoClose$.asObservable();
  }

  public get autoClose() {
    return this._autoClose$.getValue();
  }

  public set autoClose(value: boolean) {
    this._autoClose$.next(value);
  }

  public get componentVisible$() {
    return combineLatest([
      this.autoShow$,
      this.componentLoading$,
    ]).pipe(
      map(([autoShow, componentLoading]) => {
        return autoShow || !componentLoading;
      })
    )
  }

  public get componentLoading$() {
    return this._componentLoading$.asObservable();
  }

  public get componentLoading() {
    return this._componentLoading$.getValue();
  }

  public get wrapperClass() {
    return this._wrapperClass;
  }

  public get maxWidth() {
    return this._maxWidth;
  }

  public show() {
    setTimeout(() => {
      this._componentLoading$.next(false);
      setTimeout(() => {
        this.updatePosition();
      });
    });
  }

  public close() {
    this.overlayRef.detach();
    this._componentLoading$.next(true);
  }

  public updatePosition() {
    this.overlayRef.updatePosition();
  }

  private _init(config: IPopoverConfig) {
    this._wrapperClass = config.wrapperClass;
    this._maxWidth = config.maxWidth;
    this._loading = config.loading;
    this._loadingDiameter = config.loadingDiameter;
    this._size = config.size;
    this._theme = config.theme;
    this._autoShow$.next(config.autoShow);
    this._autoClose$.next(config.autoClose);
  }
}

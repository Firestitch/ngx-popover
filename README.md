# @firestitch/popover

A popover for Angular: a hover popover, a click popover, and a panel that can hold a form.

```bash
npm install @firestitch/popover
```

Import the standalone directive (or `FsPopoverModule`) and include the styles mixin in your theme:

```scss
@import '@firestitch/popover/styles';

@include fs-popover($primary-palette);
```

## Hover and click

```html
<span fsPopover text="Shown on hover">Hover me</span>

<ng-template #details let-data="data" let-popover="popover">
  {{ data.name }}
</ng-template>
<button mat-button fsPopover trigger="click" [template]="details" [data]="account">Click me</button>
```

A hover popover opens after `showDelay` and closes `leaveDelay` ms after the mouse leaves both the
host and the popover. A click popover opens on a host click and closes the same way.

## Panel mode

Set `panel` to host something people work in, such as a form. Panel mode is opt-in, and hover and
click popovers behave as before.

```html
<ng-template #filter let-popover="popover">
  <!-- fields -->
  <button mat-button (click)="popover.close()">Cancel</button>
  <button mat-flat-button color="primary" (click)="apply(); popover.close()">Apply</button>
</ng-template>

<button mat-button fsPopover [panel]="true" [template]="filter" (closed)="filterClosed()">Filter</button>

<!-- or open it from code on any element -->
<span #anchor="fsPopover" fsPopover [panel]="true" [template]="filter"></span>
<button mat-button (click)="anchor.open()">Filter</button>
```

A panel:

- opens on a host click, or when you call `open()`;
- sits on a transparent backdrop, so a click anywhere outside closes it;
- closes on Escape only when no later overlay with a backdrop sits above it. Escape in a calendar,
  select or menu opened from the panel closes only that;
- traps Tab inside. It focuses the element marked `cdkFocusInitial`, else the first tabbable element,
  else the panel itself. Focus that lands outside it is pulled back, except inside an overlay opened
  from it;
- returns focus on close to the element that was focused when it opened;
- has no mouse-leave timer;
- emits `closed` each time it closes, whether by `close()`, `popover.close()` from the content, an
  outside click or Escape.

An element opened only through `open()` still opens on a click of its own. Give it
`pointer-events: none` if it lies over something clickable.

The overlay pane has the `fs-popover-panel` class.

## Inputs

| Input | Default | |
|---|---|---|
| `text` | | Text content |
| `template` | | Template content. Its context has `data` and `popover` (`FsPopoverRef`) |
| `data` | | Passed to the template |
| `panel` | `false` | Panel mode (above) |
| `trigger` | `'mouseover'` | `'mouseover'` or `'click'`. Ignored in panel mode |
| `position` | `Position.South` | `North`, `South`, `East` or `West` |
| `maxWidth` | `250` | Pixels |
| `maxHeight` | | Pixels; content scrolls past it |
| `showDelay` | `0` | Hover: ms before it opens |
| `leaveDelay` | `100` | Hover and click: ms before it closes after the mouse leaves |
| `autoShow` | `true` | `false` shows a spinner until the content calls `popover.show()` |
| `autoClose` | `true` | Hover and click: close when the mouse leaves |
| `theme` | `'light'` | `'light'` or `'dark'` |
| `size` | `'normal'` | `'tiny'`, `'small'` or `'normal'` |
| `wrapperClass` | | A class on the popover wrapper |
| `indication` | `true` | Underlines the host |
| `enabled` | `true` | `false` turns the popover off |
| `loading`, `loadingDiameter` | `true`, `20` | The spinner shown while `autoShow` is `false` |

## Outputs and methods

| | |
|---|---|
| `closed` | Emits each time the panel closes |
| `open()` | Opens the panel. Panel mode only |
| `close()` | Closes the panel, or the open hover or click popover |

The directive is exported as `fsPopover`.

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { FsExampleModule } from '@firestitch/example';
import { FsLabelModule } from '@firestitch/label';
import { FsMessageModule } from '@firestitch/message';
import { FsPopoverModule } from '@firestitch/popover';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { FsMenuModule } from '@firestitch/menu';
import { AppComponent } from './app.component';
import {
  ExamplesComponent,
  KitchenSinkComponent
} from './components';
import { KitchenSinkConfigureComponent } from './components/kitchen-sink-configure';
import { PopoverContentWithMenuComponent } from './components/kitchen-sink/popover-content-with-menu/popover-content-with-menu.component';
import { PopoverContentComponent } from './components/kitchen-sink/popover-content/popover-content.component';
import { AppMaterialModule } from './material.module';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    FsPopoverModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsLabelModule,
    FsExampleModule.forRoot(),
    FsMessageModule.forRoot(),
    FsSkeletonModule,
    RouterModule.forRoot(routes, {}),
    FsMenuModule,
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    KitchenSinkComponent,
    KitchenSinkConfigureComponent,
    PopoverContentComponent,
    PopoverContentWithMenuComponent,
  ],
})
export class PlaygroundModule {
}

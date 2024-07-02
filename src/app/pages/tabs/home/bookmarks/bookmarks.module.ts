import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookmarksPageRoutingModule } from './bookmarks-routing.module';

import { BookmarksPage } from './bookmarks.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { TimeagoModule } from 'ngx-timeago';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookmarksPageRoutingModule,
    SharedModule,
    TimeagoModule.forRoot(),
  ],
  declarations: [BookmarksPage],
})
export class BookmarksPageModule {}

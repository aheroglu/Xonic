import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommentPageRoutingModule } from './comment-routing.module';

import { CommentPage } from './comment.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { TimeagoModule } from 'ngx-timeago';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommentPageRoutingModule,
    SharedModule,
    TimeagoModule.forRoot(),
  ],
  declarations: [CommentPage],
})
export class CommentPageModule {}

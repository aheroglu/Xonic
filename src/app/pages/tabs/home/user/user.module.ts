import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserPageRoutingModule } from './user-routing.module';

import { UserPage } from './user.page';
import { TruncatePipe } from 'src/app/pipes/truncate.pipe';
import { TimeagoModule } from 'ngx-timeago';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserPageRoutingModule,
    TimeagoModule.forRoot(),
    SharedModule
  ],
  declarations: [UserPage],
})
export class UserPageModule {}

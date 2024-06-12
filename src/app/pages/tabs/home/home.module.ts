import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { TruncatePipe } from 'src/app/pipes/truncate.pipe';
import { TimeagoModule } from 'ngx-timeago';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    TimeagoModule.forRoot(),
    SharedModule,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}

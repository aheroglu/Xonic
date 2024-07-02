import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { TimeagoModule } from 'ngx-timeago';
import { TruncatePipe } from 'src/app/pipes/truncate.pipe';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    TimeagoModule.forRoot(),
    SharedModule
  ],
  declarations: [ProfilePage],
})
export class ProfilePageModule {}

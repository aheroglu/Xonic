import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { YourAccountPage } from './your-account.page';

const routes: Routes = [
  {
    path: '',
    component: YourAccountPage
  },  {
    path: 'delete-account',
    loadChildren: () => import('./delete-account/delete-account.module').then( m => m.DeleteAccountPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YourAccountPageRoutingModule {}

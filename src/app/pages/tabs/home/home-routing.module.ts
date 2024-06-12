import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfilePageModule),
  },
  {
    path: 'bookmarks',
    loadChildren: () =>
      import('./bookmarks/bookmarks.module').then((m) => m.BookmarksPageModule),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./settings/settings.module').then((m) => m.SettingsPageModule),
  },
  {
    path: ':username',
    loadChildren: () =>
      import('./user/user.module').then((m) => m.UserPageModule),
  },
  {
    path: 'post-detail/:id',
    loadChildren: () =>
      import('./post-detail/post-detail.module').then(
        (m) => m.PostDetailPageModule
      ),
  },
  {
    path: 'comment/:id',
    loadChildren: () =>
      import('./comment/comment.module').then((m) => m.CommentPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}

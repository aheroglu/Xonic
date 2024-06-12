import { Component, OnInit } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  ToastController,
} from '@ionic/angular';
import { BookmarkService } from 'src/app/services/bookmark.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.scss'],
})
export class BookmarksPage implements OnInit {
  loggedUser: any;
  bookmarks: any;
  isLoadingShowing: boolean = false;

  constructor(
    private userService: UserService,
    private bookmarkService: BookmarkService,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  async loadUserData() {
    await this.userService.getLoggedUserData().subscribe({
      next: async (response) => {
        this.loggedUser = response;

        if (response) {
          await this.getBookmarks();
        }
      },
      error: (err) => {
        console.error(err);
        this.isLoadingShowing = false;
      },
    });
  }

  getBookmarks() {
    this.isLoadingShowing = true;

    this.bookmarkService
      .getBookmarksByUser(this.loggedUser?.user.uid)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.isLoadingShowing = false;
          this.bookmarks = response;
        },
        error: (err) => {
          this.isLoadingShowing = false;
          console.error(err);
        },
      });
  }

  async deleteBookmark(bookmark: any) {
    const toast = await this.toastCtrl.create({
      message: 'Removed from your Bookmark',
      position: 'bottom',
      duration: 3000,
      swipeGesture: 'vertical',
      animated: true,
      color: 'primary',
    });

    await this.bookmarkService
      .deleteBookmark(bookmark.id)
      .then(async () => {
        await toast.present();
        this.loadUserData();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async presentOptions() {
    const actionSheet = await this.actionSheetCtrl.create({
      animated: true,
      buttons: [
        {
          text: 'Clear all Bookmarks',
          handler: async () => {
            const alert = await this.alertCtrl.create({
              header: 'Clear all Bookmarks?',
              message:
                "This cant't be undone and you'll remove all posts you've added to your Bookmarks",
              buttons: [
                {
                  text: 'Clear',
                  handler: async () => {
                    this.bookmarkService.deleteAllBookmarks(
                      this.loggedUser.user.uid
                    );
                  },
                },
                {
                  text: 'Cancel',
                  role: 'cancel',
                },
              ],
            });

            await alert.present();
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'This feature coming soon.',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
        },
      ],
    });

    await alert.present();
  }
}

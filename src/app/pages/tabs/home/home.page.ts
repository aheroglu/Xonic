import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  IonContent,
  IonMenu,
  IonModal,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { Timestamp } from 'firebase/firestore';
import { PostService } from 'src/app/services/post.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { BookmarkService } from 'src/app/services/bookmark.service';
import { Router } from '@angular/router';
import { FollowService } from 'src/app/services/follow.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(IonContent, { static: true }) content: IonContent;
  @ViewChild(IonModal) modal: IonModal;
  @ViewChild(IonMenu) menu: IonMenu;

  selectedSegment: string;
  scrollTop: any;
  hideHeader: boolean;
  showScrollButton: boolean;
  isLoadingShowing: boolean = false;

  loggedUser: any;
  followerCount: any;
  followingCount: any;

  createArticleModel: any = {};

  followingPosts: any[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private postService: PostService,
    private toastCtrl: ToastController,
    private actionSheetController: ActionSheetController,
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private bookmarkService: BookmarkService,
    private alertCtrl: AlertController,
    public followService: FollowService
  ) {}

  ngOnInit() {
    this.selectedSegment = 'following';
    this.createArticleModel.replytype = 'Everyone can reply';

    this.loadUserData();
  }

  async loadUserData() {
    await this.userService.getLoggedUserData().subscribe({
      next: (response) => {
        this.loggedUser = response;
        this.getFollowingPosts();
        this.getFollowerCount();
        this.getFollowingCount();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getFollowingPosts() {
    this.isLoadingShowing = true;

    if (this.loggedUser) {
      this.postService.getFollowedPosts().subscribe({
        next: (response) => {
          this.isLoadingShowing = false;
          this.followingPosts = response;
        },
        error: (err) => {
          this.isLoadingShowing = false;
          console.error(err);
        },
      });
    }
  }

  async createPost() {
    const toast = await this.toastCtrl.create({
      message: 'Your post was sent',
      position: 'bottom',
      duration: 3000,
      swipeGesture: 'vertical',
      animated: true,
      color: 'primary',
    });

    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
    });

    await loading.present();

    const postData = {
      content: this.createArticleModel.content,
      created: Timestamp.now(),
      replytype: this.createArticleModel.replytype,
      uid: this.loggedUser.user.uid,
    };

    if (this.createArticleModel) {
      await this.postService
        .createPost(postData)
        .then(async () => {
          await loading.dismiss();
          await this.modal.dismiss(null, 'cancel');
          await toast.present();

          this.createArticleModel = {};
          this.createArticleModel.replytype = 'Everyone can reply';
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  async createBookmark(post: any) {
    const toast = await this.toastCtrl.create({
      message: 'Added to your Bookmarks',
      position: 'bottom',
      duration: 3000,
      swipeGesture: 'vertical',
      animated: true,
      color: 'primary',
      buttons: [
        {
          text: 'View Bookmarks',
          handler: () => this.router.navigate(['/tabs/home/bookmarks']),
        },
      ],
    });

    const model = {
      postid: post.id,
      uid: this.loggedUser.user.uid,
      created: Timestamp.now(),
    };

    await this.bookmarkService
      .createBookmark(model)
      .then(async () => {
        await toast.present();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async likePost(post: any) {
    await this.postService
      .likePost(post.id, this.loggedUser.user.uid)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  isLikedByUser(post: any): boolean {
    const userId = this.loggedUser.user.uid;
    return post.likes && post.likes.includes(userId);
  }

  async changeReplyType() {
    const actionSheet = await this.actionSheetController.create({
      animated: true,
      buttons: [
        {
          text: 'Everyone can reply',
          handler: () => {
            this.createArticleModel.replytype = 'Everyone can reply';
          },
        },
        {
          text: 'Accounts you follow',
          handler: () => {
            this.createArticleModel.replytype = 'Accounts you follow';
          },
        },
      ],
    });

    await actionSheet.present();
  }

  getFollowerCount() {
    this.followService
      .getFollowerCountByUser(this.loggedUser.user.uid)
      .subscribe({
        next: (response) => {
          this.followerCount = response;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  getFollowingCount() {
    this.followService
      .getFollowingCountByUser(this.loggedUser.user.uid)
      .subscribe({
        next: (response) => {
          this.followingCount = response;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  async refreshPage(event: any) {
    await this.loadUserData();
    await this.getFollowingPosts();
    await event.target.complete();
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.target.value;
  }

  scrollToTop() {
    this.content.scrollToTop(1000);
  }

  onScroll(event: any) {
    this.scrollTop = event.detail.scrollTop;

    if (this.scrollTop > 80) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }

    if (this.scrollTop > 500) {
      this.showScrollButton = true;
    } else {
      this.showScrollButton = false;
    }
  }

  closeModal() {
    this.modal.dismiss(null, 'cancel');
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

  async signOut() {
    this.authService.signOut();
  }
}

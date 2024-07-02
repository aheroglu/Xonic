import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  ToastController,
} from '@ionic/angular';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.page.html',
  styleUrls: ['./post-detail.page.scss'],
})
export class PostDetailPage implements OnInit {
  scrollTop: any;
  hideHeader: boolean;
  isLoadingShowing: boolean = false;

  postId: string;
  post: any;
  commentsArray: any[] = [];

  loggedUser: any;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private userService: UserService,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe({
      next: (params) => {
        this.postId = params.get('id');

        if (this.postId) {
          this.loadUserData();
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  loadUserData() {
    this.userService.getLoggedUserData().subscribe({
      next: (response) => {
        this.loggedUser = response;
        this.loadPost();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  loadPost() {
    this.isLoadingShowing = true;

    this.postService.getPost(this.postId).subscribe({
      next: (response) => {
        this.isLoadingShowing = false;
        this.post = response;
        this.commentsArray = Object.values(this.post.comments);
      },
      error: (err) => {
        this.isLoadingShowing = false;
        console.error(err);
      },
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
    if (this.loggedUser) {
      const userId = this.loggedUser.user.uid;
      return post.likes && post.likes.includes(userId);
    } else {
      return false;
    }
  }

  onScroll(event: any) {
    this.scrollTop = event.detail.scrollTop;

    if (this.scrollTop > 80) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }
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

  async presentActionSheet(uid: string, postId: string, commentId: string) {
    const actionSheetButtons = [];

    if (uid === this.loggedUser.user.uid) {
      actionSheetButtons.push({
        text: 'Delete your comment',
        handler: async () => {
          this.postService.deleteComment(postId, commentId).then(async () => {
            const toast = await this.toastCtrl.create({
              message: 'Comment deleted successfully',
              position: 'bottom',
              duration: 3000,
              swipeGesture: 'vertical',
              animated: true,
              color: 'primary',
            });

            await toast.present();
          });
        },
      });
    }

    actionSheetButtons.push({
      text: 'Report this comment',
      handler: async () => {
        const alert = await this.alertCtrl.create({
          header: 'This feature will coming soon',
          buttons: [
            {
              text: 'Ok',
              role: 'cancel',
            },
          ],
        });

        await alert.present();
      },
    });

    const action = await this.actionSheetCtrl.create({
      animated: true,
      buttons: actionSheetButtons,
    });

    await action.present();
  }
}

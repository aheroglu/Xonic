import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
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
    private alertCtrl: AlertController
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
        console.log(response);
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
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonContent } from '@ionic/angular';
import { FollowService } from 'src/app/services/follow.service';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { simplifyUrl } from 'src/app/utils/utils';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  @ViewChild(IonContent, { static: true }) content: IonContent;

  selectedSegment: string;
  hideHeader: boolean;
  showScrollButton: boolean;
  scrollTop: any;
  isLoadingShowing: boolean = false;

  posts: any[] = [];
  replies: any[] = [];
  likes: any[] = [];

  loggedUser: any;
  followerCount: any;
  followingCount: any;

  constructor(
    private userService: UserService,
    private postService: PostService,
    private alertCtrl: AlertController,
    private followService: FollowService
  ) {}

  ngOnInit() {
    this.selectedSegment = 'posts';
    this.loadUserData();
  }

  async loadUserData() {
    await this.userService.getLoggedUserData().subscribe({
      next: (response) => {
        this.loggedUser = response;
        this.loadPosts();
        this.loadLikes();
        this.loadReplies();
        this.getFollowerCount();
        this.getFollowingCount();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  loadPosts() {
    if (this.loggedUser) {
      this.postService.getPostsByUser(this.loggedUser.userData.id).subscribe({
        next: (response) => {
          this.posts = response;
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }

  loadReplies() {
    this.postService.getRepliesByUser(this.loggedUser.user.uid).subscribe({
      next: (response) => {
        console.log(response);
        this.replies = response;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  loadLikes() {
    this.postService.getLikesByUser(this.loggedUser.userData.id).subscribe({
      next: (response) => {
        this.likes = response;
      },
      error: (err) => {
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
    const userId = this.loggedUser.user.uid;
    return post.likes && post.likes.includes(userId);
  }

  simplifyUrl(url: string): string {
    return simplifyUrl(url);
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
    await this.loadPosts();
    await this.loadReplies();
    await this.loadLikes();
    await event.target.complete();
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.target.value;
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

  scrollToTop() {
    this.content.scrollToTop(1000);
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

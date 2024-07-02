import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonContent, ToastController } from '@ionic/angular';
import { Timestamp } from 'firebase/firestore';
import { BookmarkService } from 'src/app/services/bookmark.service';
import { FollowService } from 'src/app/services/follow.service';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { simplifyUrl } from 'src/app/utils/utils';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  selectedSegment: string;
  hideHeader: boolean;
  showScrollButton: boolean;
  scrollTop: any;
  isUserFollowing: boolean = false;

  posts: any[] = [];
  followingData: any;
  followerCount: any;
  followingCount: any;

  loadedUsername: string;
  loadedUser: any;
  loggedUser: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private followService: FollowService,
    private postService: PostService,
    private toastCtrl: ToastController,
    private bookmarkService: BookmarkService,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe({
      next: async (params) => {
        this.loadedUsername = params.get('username');

        if (this.loadedUsername) {
          this.selectedSegment = 'posts';
          await this.loadLoggedUserData();
          await this.loadUserData();
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  async loadLoggedUserData() {
    await this.userService.getLoggedUserData().subscribe({
      next: (response) => {
        this.loggedUser = response;
        this.checkFollowStatus();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  async loadUserData() {
    await this.userService.getLoadedUserData(this.loadedUsername).subscribe({
      next: (response) => {
        this.loadedUser = response;
        this.getPosts();
        this.getFollowerCount();
        this.getFollowingCount();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getPosts() {
    this.postService.getPostsByUser(this.loadedUser.id).subscribe({
      next: (response) => {
        this.posts = response;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  checkFollowStatus() {
    this.followService
      .checkFollowStatus(this.loadedUser?.id, this.loggedUser?.user.uid)
      .subscribe({
        next: (response) => {
          console.log(response);
          if (response.length > 0) {
            this.isUserFollowing = true;
            this.followingData = response;
            console.log(this.followingData);
          } else {
            this.isUserFollowing = false;
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  async followUser() {
    const model = {
      followeduserid: this.loadedUser.id,
      followeruserid: this.loggedUser.user.uid,
    };

    await this.followService
      .followUser(model)
      .then(async () => {})
      .catch((err) => {
        console.error(err);
      });
  }

  async unfollowUser() {
    await this.followService.unfollowUser(this.followingData[0].id);
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

  isLikedByUser(post: any): boolean {
    const userId = this.loggedUser.user.uid;
    return post.likes && post.likes.includes(userId);
  }

  getFollowerCount() {
    this.followService.getFollowerCountByUser(this.loadedUser.id).subscribe({
      next: (response) => {
        this.followerCount = response;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getFollowingCount() {
    this.followService.getFollowingCountByUser(this.loadedUser.id).subscribe({
      next: (response) => {
        this.followingCount = response;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.target.value;
  }

  simplifyUrl(url: string): string {
    return simplifyUrl(url);
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

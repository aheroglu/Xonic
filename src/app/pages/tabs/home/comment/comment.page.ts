import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Timestamp } from 'firebase/firestore';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.page.html',
  styleUrls: ['./comment.page.scss'],
})
export class CommentPage implements OnInit {
  postId: string;
  post: any;
  loggedUser: any;

  model: any = {};

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private userService: UserService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe({
      next: (params) => {
        this.postId = params.get('id');

        if (this.postId) {
          this.getLoggedUser();
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getLoggedUser() {
    this.userService.getLoggedUserData().subscribe({
      next: (response) => {
        this.loggedUser = response;
        this.getPost();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getPost() {
    this.postService.getPost(this.postId).subscribe({
      next: (response) => {
        this.post = response;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  async onFormSubmit() {
    const toast = await this.toastCtrl.create({
      message: 'Your comment was sent',
      position: 'bottom',
      duration: 3000,
      swipeGesture: 'vertical',
      animated: true,
      color: 'primary',
    });

    const data = {
      postid: this.post.id,
      user: this.loggedUser.userData,
      created: Timestamp.now(),
      content: this.model.content,
    };

    await this.postService
      .createComment(this.post.id, data)
      .then(async () => {
        await toast.present();
        this.router.navigate(['/tabs/home']);
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

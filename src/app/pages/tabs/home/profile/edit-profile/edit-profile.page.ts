import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/services/profile.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  loggedUser: any;

  model: any = {};

  constructor(
    private userService: UserService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  async loadUserData() {
    await this.userService.getLoggedUserData().subscribe({
      next: (response) => {
        this.loggedUser = response;
        this.model = response.userData;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  async onFormSubmit() {
    if (this.model) {
      await this.profileService
        .updateUserData(this.loggedUser.user.uid, this.model)
        .then(() => {
          this.router.navigate(['/tabs/home/profile']);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }
}

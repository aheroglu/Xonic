import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.page.html',
  styleUrls: ['./delete-account.page.scss'],
})
export class DeleteAccountPage implements OnInit {
  loggedUser: any;

  constructor(
    private userService: UserService,
    private alertCtrl: AlertController,
    private profileService: ProfileService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getLoggedUser();
  }

  async getLoggedUser() {
    await this.userService.getLoggedUserData().subscribe({
      next: (response) => {
        this.loggedUser = response;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  async onClick() {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure you want to delete your Xonic account?',
      message: 'This operation cannot be undone!',
      buttons: [
        {
          text: 'Yes',
          handler: async () => {
            await this.profileService
              .deleteUser()
              .then(async () => {
                await this.authService.signOut();
              })
              .catch((err) => {
                console.error(err);
              });
          },
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });

    await alert.present();
  }
}

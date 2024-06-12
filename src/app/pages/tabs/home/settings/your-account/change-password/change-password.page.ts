import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  loggedUser: any;

  model: any = {};

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private alertCtrl: AlertController
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

  async onFormSubmit() {
    if (this.model.email === this.loggedUser.user.email) {
      const alert = await this.alertCtrl.create({
        header: 'Password Reset Link Has Been Sent',
        message:
          'If you have not received email, check your email address is valid',
        buttons: [
          {
            text: 'OK',
            role: 'cancel',
          },
        ],
      });

      await this.authService
        .resetPassword(this.model)
        .then(async () => {
          await alert.present();
          await this.authService.signOut();
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Incorrect email!',
        buttons: [
          {
            text: 'OK',
            role: 'cancel',
          },
        ],
      });

      await alert.present();
      return;
    }
  }
}

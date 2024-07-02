import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {
  model: any = {};

  constructor(
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  async onFormSubmit(form: NgForm) {
    const alert = await this.alertCtrl.create({
      header: 'Password reset email was sent. Please check your mailbox',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
        },
      ],
    });

    if (form.valid) {
      this.authService
        .resetPassword(this.model)
        .then(async () => {
          this.router.navigateByUrl('/welcome');
          await alert.present();
        })
        .catch((err: HttpErrorResponse) => {
          console.error(err);
        });
    }
  }
}

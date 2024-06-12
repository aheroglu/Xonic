import { Component } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  model: any = {};

  constructor(
    private authService: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ionViewWillLeave() {
    this.model = {};
  }

  async onFormSubmit() {
    if (this.model.password !== this.model.confirmPassword) {
      const alert = await this.alertCtrl.create({
        header: 'Passwords do not match!',
        buttons: ['Ok'],
      });

      await alert.present();
      return;
    }

    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
    });

    await loading.present();

    await this.authService
      .signUp(this.model)
      .then(async () => {
        await loading.dismiss();
        await this.authService.signIn(this.model);
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

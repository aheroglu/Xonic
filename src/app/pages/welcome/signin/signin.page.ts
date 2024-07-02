import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage {
  model: any = {};
  footerVisible: boolean = true;

  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController
  ) {}

  ionViewWillLeave() {
    this.model = {};
  }

  async onFormSubmit() {
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
    });

    await loading.present();

    await this.authService
      .signIn(this.model)
      .then(async () => {
        await loading.dismiss();
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

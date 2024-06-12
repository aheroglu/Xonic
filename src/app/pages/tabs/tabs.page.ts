import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  constructor(private alertCtrl: AlertController) {}

  async triggerAlert() {
    const alert = await this.alertCtrl.create({
      header: 'This feature will coming soon.',
      buttons: ['Ok'],
    });

    await alert.present();
  }
}

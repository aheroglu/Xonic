import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CanActivateFn, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map((user) => {
        if (user) {
          return true;
        } else {
          this.presentAlert().then(() => {
            this.router.navigate(['/welcome']);
          });
          return false;
        }
      })
    );
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Please sign in!',
      buttons: ['Ok'],
    });
    await alert.present();
  }
}

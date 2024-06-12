import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, collection, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Timestamp, doc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private firestore: Firestore,
    private afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  async signUp(model: any) {
    return await this.afAuth
      .createUserWithEmailAndPassword(model.email, model.password)
      .then(async (response) => {
        console.log(response);

        const userData = {
          bio: '',
          birthdate: model.birthdate,
          coverimage: '',
          email: model.email,
          id: response.user.uid,
          joined: Timestamp.now(),
          location: '',
          name: model.name,
          profileimage: '',
          username: model.username,
          website: '',
        };
        const collectionInstance = collection(this.firestore, 'users');
        await setDoc(doc(collectionInstance, response.user.uid), userData)
          .then((response) => {
            console.log(response);
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch(async (err) => {
        if (err.code === 'auth/email-already-in-use') {
          await this.presentAlert(
            'This email address is already being using by another acount!'
          );
        }
      });
  }

  async signIn(model: any) {
    return await this.afAuth
      .signInWithEmailAndPassword(model.email, model.password)
      .then(() => {
        this.router.navigate(['/tabs/home']);
      })
      .catch(async (err) => {
        if (err.code === 'auth/missing-email') {
          await this.presentAlert('Please enter email adress!');
          return;
        } else if (err.code === 'auth/invalid-email') {
          await this.presentAlert('Please enter valid email adress!');
          return;
        } else if (err.code === 'auth/invalid-credential') {
          await this.presentAlert('Incorrect email or password!');
          return;
        }
      });
  }

  async resetPassword(model: any) {
    return await this.afAuth
      .sendPasswordResetEmail(model.email)
      .catch((err) => {
        console.error(err);
      });
  }

  async getLoggedUser() {
    return this.afAuth.currentUser;
  }

  async signOut() {
    return await this.afAuth
      .signOut()
      .then(() => {
        this.router.navigate(['/welcome']);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async presentAlert(header: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      buttons: ['Ok'],
    });
    await alert.present();
  }
}

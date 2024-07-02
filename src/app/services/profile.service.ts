import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Firestore } from '@angular/fire/firestore';
import { collection, doc, query, updateDoc, where } from 'firebase/firestore';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    private firestore: Firestore,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  async updateUserData(uid: string, model: any): Promise<any> {
    const docRef = doc(this.firestore, 'users', uid);
    await updateDoc(docRef, model)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // onFileSelected(event: any, type: string) {
  //   const file = event.target.files[0];
  //   const filePath = type === 'profile' ? `profile/${file.name}` : `cover/${file.name}`;
  //   const fileRef = this.storage.ref(filePath);
  //   const task = this.storage.upload(filePath, file);

  //   task.snapshotChanges().pipe(
  //     finalize(() => {
  //       fileRef.getDownloadURL().subscribe((url) => {
  //         if (type === 'profile') {
  //           this.model.profileimage = url;
  //         } else {
  //           this.model.coverimage = url;
  //         }
  //       });
  //     })
  //   ).subscribe();
  // }

  // triggerFileInput(type: string) {
  //   if (type === 'profile') {
  //     document.getElementById('profileInput').click();
  //   } else {
  //     document.getElementById('coverInput').click();
  //   }
  // }

  async deleteUser() {
    return new Promise<void>((resolve, reject) => {
      this.afAuth.currentUser
        .then((user) => {
          if (user) {
            user
              .delete()
              .then(() => {
                resolve();

                this.afs
                  .collection('posts', (ref) =>
                    ref.where('uid', '==', user.uid)
                  )
                  .get()
                  .toPromise()
                  .then((querySnapshot) => {
                    const batch = this.afs.firestore.batch();
                    querySnapshot.forEach((doc) => {
                      batch.delete(doc.ref);
                    });
                  });
              })
              .catch((err) => {
                reject(err);
              });
          } else {
            reject('No user in currently signed in.');
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

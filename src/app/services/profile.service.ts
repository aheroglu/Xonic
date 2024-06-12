import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, doc, query, updateDoc, where } from 'firebase/firestore';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private firestore: Firestore) {}

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
}

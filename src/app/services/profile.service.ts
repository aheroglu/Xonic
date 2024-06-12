import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, doc, query, updateDoc, where } from 'firebase/firestore';

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
}

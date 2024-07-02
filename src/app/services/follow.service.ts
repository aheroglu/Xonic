import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Firestore, addDoc, collectionData } from '@angular/fire/firestore';
import { collection, doc, query, updateDoc, where } from 'firebase/firestore';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FollowService {
  constructor(private firestore: Firestore, private afs: AngularFirestore) {}

  async followUser(model: any): Promise<void> {
    const collectionRef = collection(this.firestore, 'follows');
    await addDoc(collectionRef, model)
      .then(async (response) => {
        const idData = {
          id: response.id,
        };
        const docRef = doc(this.firestore, 'follows', idData.id);
        await updateDoc(docRef, idData)
          .then((response) => {
            console.log(response);
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async unfollowUser(followId: string): Promise<void> {
    await this.afs.collection('follows').doc(followId).delete();
  }

  checkFollowStatus(
    followeduserid: string,
    followeruserid: string
  ): Observable<any> {
    const q = query(
      collection(this.firestore, 'follows'),
      where('followeduserid', '==', followeduserid),
      where('followeruserid', '==', followeruserid)
    );

    return collectionData(q).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getFollowerCountByUser(uid: string): Observable<any> {
    const q = query(
      collection(this.firestore, 'follows'),
      where('followeduserid', '==', uid)
    );

    return collectionData(q).pipe(
      map((response) => {
        return response.length;
      })
    );
  }

  getFollowingCountByUser(uid: string): Observable<any> {
    const q = query(
      collection(this.firestore, 'follows'),
      where('followeruserid', '==', uid)
    );

    return collectionData(q).pipe(
      map((response) => {
        return response.length;
      })
    );
  }
}

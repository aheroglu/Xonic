import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, collectionData, query } from '@angular/fire/firestore';
import { collection, where } from 'firebase/firestore';
import { Observable, map, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: Firestore, private afAuth: AngularFireAuth) {}

  getLoggedUserData(): Observable<any> {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          const q = query(
            collection(this.firestore, 'users'),
            where('id', '==', user.uid)
          );
          return collectionData(q).pipe(
            map((userDataArray: any) => {
              const userData = userDataArray[0];
              if (userData && userData.joined) {
                userData.joined = userData.joined.toDate();
              }
              return { user: user, userData: userData };
            })
          );
        } else {
          return of(null);
        }
      })
    );
  }

  getLoadedUserData(username: string): Observable<any> {
    const q = query(
      collection(this.firestore, 'users'),
      where('username', '==', username)
    );

    return collectionData(q).pipe(
      map((response) => {
        return response[0];
      })
    );
  }

  getUser(uid: string): Observable<any> {
    const q = query(
      collection(this.firestore, 'users'),
      where('id', '==', uid)
    );

    return collectionData(q).pipe(
      map((response) => {
        return response;
      })
    );
  }
}

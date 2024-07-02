import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Firestore, collectionData, docData } from '@angular/fire/firestore';
import {
  addDoc,
  collection,
  doc,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookmarkService {
  constructor(private firestore: Firestore, private afs: AngularFirestore) {}

  getBookmarksByUser(uid: string): Observable<any> {
    const q = query(
      collection(this.firestore, 'bookmarks'),
      where('uid', '==', uid),
      orderBy('created', 'desc')
    );

    return collectionData(q).pipe(
      switchMap((bookmarks: any[]) => {
        if (bookmarks.length == 0) {
          return of([]);
        }

        const detailedBookmarks$ = bookmarks.map((bookmark) => {
          const postDocRef = this.afs.doc(`posts/${bookmark.postid}`).get();

          return postDocRef.pipe(
            switchMap((postDoc: any) => {
              const postData = postDoc.data();
              postData.created = postData.created.toDate();

              const userDocRef = this.afs.doc(`users/${postData.uid}`).get();

              return userDocRef.pipe(
                map((userDoc) => ({
                  ...bookmark,
                  post: postData,
                  user: userDoc.data(),
                }))
              );
            })
          );
        });

        return forkJoin(detailedBookmarks$);
      })
    );
  }

  async createBookmark(model: any): Promise<void> {
    const collectionRef = collection(this.firestore, 'bookmarks');
    await addDoc(collectionRef, model)
      .then(async (response) => {
        const idData = {
          id: response.id,
        };
        const docRef = doc(this.firestore, 'bookmarks', idData.id);
        await updateDoc(docRef, idData)
          .then((response) => {
            console.log(response);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async deleteBookmark(id: string): Promise<void> {
    await this.afs.collection('bookmarks').doc(id).delete();
  }

  deleteAllBookmarks(uid: string) {
    this.afs
      .collection('bookmarks', (ref) => ref.where('uid', '==', uid))
      .get()
      .subscribe({
        next: (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.afs
              .collection('bookmarks')
              .doc(doc.id)
              .delete()
              .then((response) => {
                console.log(response);
              })
              .catch((err) => {
                console.error(err);
              });
          });
        },
      });
  }
}

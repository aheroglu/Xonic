import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Firestore, addDoc, collectionData } from '@angular/fire/firestore';
import { collection } from '@angular/fire/firestore';
import {
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Observable, combineLatest, from, map, of, switchMap } from 'rxjs';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(
    private firestore: Firestore,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  getPostsByUser(uid: string): Observable<any> {
    const q = query(
      collection(this.firestore, 'posts'),
      where('uid', '==', uid),
      orderBy('created', 'desc')
    );

    return collectionData(q, { idField: 'id' }).pipe(
      switchMap((posts: any[]) => {
        const postsWithLikes$ = posts.map(async (post) => {
          post.created = post.created.toDate();
          const likesQuery = query(
            collection(this.firestore, 'likes'),
            where('postid', '==', post.id)
          );
          const likesSnapshot = await getDocs(likesQuery);
          const likeCount = likesSnapshot.size;

          return {
            ...post,
            likeCount,
          };
        });

        return from(Promise.all(postsWithLikes$));
      })
    );
  }

  getFollowedPosts(): Observable<any[]> {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          const userId = user.uid;
          return this.afs
            .collection('follows', (ref) =>
              ref.where('followeruserid', '==', userId)
            )
            .valueChanges({ idField: 'id' })
            .pipe(
              switchMap((follows: any[]) => {
                if (follows.length > 0) {
                  const followedUserIds = follows.map(
                    (follow) => follow.followeduserid
                  );
                  return this.afs
                    .collection('posts', (ref) =>
                      ref.where('uid', 'in', followedUserIds)
                    )
                    .snapshotChanges()
                    .pipe(
                      switchMap((postSnapshots) => {
                        const posts = postSnapshots.map((snap) => {
                          const data: any = snap.payload.doc.data();
                          if (data.created) {
                            data.created = data.created.toDate();
                          }
                          return { id: snap.payload.doc.id, ...data };
                        });

                        const userObservables = posts.map((post) =>
                          this.afs
                            .collection('users')
                            .doc(post.uid)
                            .valueChanges()
                            .pipe(
                              map((userData) => ({ ...post, user: userData }))
                            )
                        );

                        return userObservables.length > 0
                          ? combineLatest(userObservables)
                          : of([]);
                      })
                    );
                } else {
                  return of([]);
                }
              })
            );
        } else {
          return of([]);
        }
      })
    );
  }

  getPost(id: string): Observable<any> {
    return this.afs
      .collection('posts')
      .doc(id)
      .valueChanges()
      .pipe(
        switchMap((post: any) => {
          if (post.created) {
            post.created = post.created.toDate();
          }

          return this.afs
            .collection('users')
            .doc(post.uid)
            .valueChanges()
            .pipe(
              map((user) => {
                return { ...post, user: user };
              })
            );
        })
      );
  }

  async createPost(model: any): Promise<void> {
    const collectionRef = collection(this.firestore, 'posts');
    await addDoc(collectionRef, model)
      .then(async (response) => {
        const idData = {
          id: response.id,
        };
        const docRef = doc(this.firestore, 'posts', idData.id);
        await updateDoc(docRef, idData)
          .then((response) => {
            console.log(response);
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async createComment(postId: string, data: any): Promise<any> {
    const commentId = this.afs.createId();
    const comment = {
      ...data,
      id: commentId,
    };
    const postRef = this.afs.collection('posts').doc(postId);
    return postRef.update({
      [`comments.${commentId}`]: comment,
    });
  }

  async deleteComment(postId: string, commentId: string): Promise<void> {
    const postRef = this.afs.collection('posts').doc(postId);
    const updateData = {
      [`comments.${commentId}`]: firebase.firestore.FieldValue.delete(),
    };
    await postRef.update(updateData);
  }

  async likePost(postId: string, userId: string): Promise<void> {
    const postRef = this.afs.collection('posts').doc(postId);
    const postDoc = await postRef.get().toPromise();

    if (postDoc.exists) {
      const postData: any = postDoc.data();
      const likes = postData?.likes || [];

      if (likes.includes(userId)) {
        await postRef.update({
          likes: firebase.firestore.FieldValue.arrayRemove(userId),
        });
      } else {
        await postRef.update({
          likes: firebase.firestore.FieldValue.arrayUnion(userId),
        });
      }
    } else {
      console.error('Post does not exist!');
    }
  }

  getLikesByUser(uid: string): Observable<any[]> {
    return this.afs
      .collection('posts', (ref) => ref.where('likes', 'array-contains', uid))
      .snapshotChanges()
      .pipe(
        switchMap((postsSnapshot) => {
          const posts = postsSnapshot.map((snap) => {
            const data = snap.payload.doc.data() as any;
            const id = snap.payload.doc.id;
            return { id, ...data };
          });

          if (posts.length === 0) {
            return of([]);
          }

          const userObservables = posts.map((post) => {
            return this.afs
              .collection('users')
              .doc(post.uid)
              .valueChanges()
              .pipe(
                map((user) => {
                  post.created = post.created
                    ? post.created.toDate()
                    : new Date();
                  return { ...post, user };
                })
              );
          });

          return combineLatest(userObservables);
        })
      );
  }

  getRepliesByUser(uid: string): Observable<any[]> {
    return this.afs
      .collection('posts')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data: any = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        ),
        map((posts) =>
          posts
            .map((post) => {
              const comments = Object.values(post.comments || {}).filter(
                (comment: any) => comment.user.id === uid
              );
              return comments.length ? { ...post, comments } : null;
            })
            .filter((post) => post !== null)
        )
      );
  }
}

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { query, where } from 'firebase/firestore';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private firestore: Firestore, private af: AngularFirestore) {}

  searchUserByName(searchKey: string) {
    const q = query(
      collection(this.firestore, 'users'),
      where('name', '>=', searchKey),
      where('name', '<=', searchKey + '\uf8ff')
    );

    return collectionData(q).pipe(
      map((response) => {
        return response;
      })
    );
  }

  searchUserByUsername(searchKey: string) {
    searchKey = searchKey.slice(1);

    const q = query(
      collection(this.firestore, 'users'),
      where('username', '>=', searchKey),
      where('username', '<=', searchKey + '\uf8ff')
    );

    return collectionData(q).pipe(
      map((response) => {
        return response;
      })
    );
  }
}

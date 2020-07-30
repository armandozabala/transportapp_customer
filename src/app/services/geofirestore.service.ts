import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import { GeoCollectionReference, GeoFirestore, GeoQuery } from 'geofirestore';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class GeofirestoreService {

  geofirestore: GeoFirestore;
  geocollection: GeoCollectionReference;
  radius = 1;

  constructor(private db: AngularFirestore) { 

      this.geofirestore = new GeoFirestore(this.db.firestore);
      this.geocollection = this.geofirestore.collection('restaurants');
  }

  setRadius(radius){
     this.radius = radius;
  }

  getDocument(id:any){

        return this.db.doc('restaurants/'+id).get();

  }

  addGeoCollection(row: any){

      this.geocollection.add({
          name: row.name,
          score: row.score,
          customer: row.customer,
          phone: row.phone,
          coordinates: new firebase.firestore.GeoPoint(row.lat, row.lng)
      });

  }

  geoQuery(latLng:any){

    const query: GeoQuery = this.geocollection.near({ center: new firebase.firestore.GeoPoint(latLng.lat(), latLng.lng()), radius: this.radius });

    return query.get();
 }
}

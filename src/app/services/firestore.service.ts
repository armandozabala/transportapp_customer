import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  public usersShow:any = {};

  userChange: Subject<any> = new Subject<any>()

  constructor(public db: AngularFirestore, private router: Router) {
     
     /* this.userChange.subscribe((value) => {
        alert(value);
        this.usersShow = value;
    });*/
  }

  //ORDERS 
  
  reportOrder(order: any) {
    return this.db.collection("orders").add(order);
  }



  getAllOrdersByDateStatus(companyId:any, userId:any, dates:any, status:any){
    return this.db.collection("companys/"+companyId+"/order", ref => ref.where( 'status','==', status).where( 'datedelivery','==', dates).where('driverId','==',userId)).snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
        })
     ))
  }


  loadStorage(){

    if(localStorage.getItem('users')){
          //console.log(JSON.parse(localStorage.getItem('users')));
          this.usersShow = JSON.parse(localStorage.getItem('users'));
    }else{
          this.usersShow = {};
      }
  }


 


  saveStorage(documentId: any, dataUser: any){
 
    localStorage.setItem('id', documentId);
    localStorage.setItem('users', JSON.stringify(dataUser));

  }

    //edit user - get
    getUser(documentId: string) {
      return this.db.collection("users").doc(documentId).snapshotChanges().pipe(
        map((changes:any) => {
          const data = changes.payload.data();
          const id = changes.payload.id;
          return { id, ...data };
        }));
    }

      //UID
  getUserUID(uid: string) {
    return this.db.collection("users", ref=> ref.where('id',"==",uid)).valueChanges().pipe(
      map((changes:any) => {
        this.saveStorage(changes[0].id, changes[0]);
        return true;
      }));
  }

  createUserForm(user: any) {
    return this.db.collection("users").add(user);
  }

  createUserUID(user: any) {
    return this.db.collection("users").doc(user.id).set(user);
  }

  createClienteUID(user: any) {
    return this.db.collection("client").doc(user.id).set(user);
  }

  getClienteUID(uid: string) {
    return this.db.collection("client", ref=> ref.where('id',"==",uid)).valueChanges().pipe(
      map((changes:any) => {
        console.log(changes);
        if(changes.length == 0){
            return false;
        }else{
          this.saveStorage(changes[0].id, changes[0]);
          return true;
        }
       
      }));
  }

  createOrderRequest(order:any){
    return this.db.collection("orderRequest").add(order);
  }

    //edit user - get
    getOrderRequest(uid: string) {
      return this.db.collection("orderRequest", ref=> ref.orderBy('datedeliveryorder','desc').where('uid',"==",uid)).snapshotChanges().pipe(
        map(actions =>
          actions.map(a => {
              const data = a.payload.doc.data() as any;
              const id = a.payload.doc.id;
              return { id, ...data };
          })
       ))
    }

        //edit user - get
        getHistoryOrders(uid: string) {
          return this.db.collection("orderRequest", ref=> ref.where('uid',"==",uid).where('status','>',1)).snapshotChanges().pipe(
            map(actions =>
              actions.map(a => {
                  const data = a.payload.doc.data() as any;
                  const id = a.payload.doc.id;
                  return { id, ...data };
              })
           ))
        }

}

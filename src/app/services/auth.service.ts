import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { HttpClient } from  '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public http: HttpClient, public  afAuth:  AngularFireAuth, private router: Router) { }


  createUser(user: any){

    return this.afAuth.createUserWithEmailAndPassword(user.email, user.password);

  }


  signUser(email:any, password:any, remember: boolean = false){

    if(remember){
        localStorage.setItem('email',email);
    }else{
        localStorage.removeItem('email');
    }
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async logout(){
    await this.afAuth.signOut();
  
  }

  isAuth(): any{
    return this.afAuth.authState;
}

  statusUser(){
    console.log(localStorage.getItem('token'));
   if(localStorage.getItem('token') == 'undefined' || localStorage.getItem('token') == null ){
      return false;
   }else{
     return true;

   }
  }
}

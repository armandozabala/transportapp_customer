import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { HttpClient } from  '@angular/common/http';

import { auth} from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public http: HttpClient, public  afAuth:  AngularFireAuth, private router: Router, private googlePlus: GooglePlus) { }


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


  loginGoogle(){


      return this.googlePlus.login({}).then(res =>{

          const user = res;

          alert(user);

          return this.afAuth.signInWithCredential( auth.GoogleAuthProvider.credential(null, user.accessToken))

      }).catch(error => {

      })

     
  }

  async resetPassword(email: string){
    try{
        return this.afAuth.sendPasswordResetEmail(email);
    }catch(err){
        console.log(err);
    }
  }

  async logout(){
    await this.afAuth.signOut();
    localStorage.removeItem('users');
  
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

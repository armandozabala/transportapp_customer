import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { HttpClient } from  '@angular/common/http';

import { auth} from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public http: HttpClient, public  afAuth:  AngularFireAuth, private router: Router, private googlePlus: GooglePlus, private fb: Facebook) { }


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

  loginFacebook(){

    return this.fb.login(['public_profile','email'])
      .then((res: FacebookLoginResponse) => {

        console.log('Logged into Facebook!', res);


        const credentials_fb = auth.FacebookAuthProvider.credential(res.authResponse.accessToken);

        this.getUserDetail(res.authResponse.userID);

        return this.afAuth.signInWithCredential(credentials_fb);

      })
      .catch(e => console.log('Error logging into Facebook', e));

  }

  getUserDetail(userid: any) {
    return this.fb.api('/' + userid + '/?fields=id,email,name,picture', ['public_profile'])
      .then(res => {
        //alert(JSON.stringify(res));
 
        localStorage.setItem('photo',res.picture.data.url);
        localStorage.setItem('name',res.name);
        localStorage.setItem('email',res.email)
      
      })
      .catch(e => {
        console.log(e);
      });
  }


  loginGoogle(){


     return this.googlePlus.login({}).then(res =>{

   
          return this.afAuth.signInWithCredential( auth.GoogleAuthProvider.credential(null, res.accessToken)).then(resp =>{

      
              return resp;

          });

         

      }).catch(error => {
          alert(error)
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

    this.googlePlus.disconnect();

    this.googlePlus.logout();
  
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

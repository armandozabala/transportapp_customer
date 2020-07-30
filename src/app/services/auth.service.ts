import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { HttpClient } from  '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public http: HttpClient, public  afAuth:  AngularFireAuth, private router: Router) { }

  signUser(email:any, password:any, remember: boolean = false){

    if(remember){
        localStorage.setItem('email',email);
    }else{
        localStorage.removeItem('email');
    }
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async logout(){
    localStorage.removeItem('users');
    localStorage.removeItem('id');
    localStorage.removeItem('email');
    await this.afAuth.signOut();
    this.router.navigate(['/login']);
  }
}

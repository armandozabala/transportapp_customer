import { Component, OnInit, Inject } from '@angular/core';
import { MenuController, Platform, ToastController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { Router } from '@angular/router';
import swal from'sweetalert2';
import { BackgroundtaskService } from 'src/app/services/backgroundtask.service';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  disconnectSubscription:any;
  connectSubscription:any;

  type:any;
  conectados: boolean;

  email:any;
  password:any;


  signupView: boolean = false

  constructor() { 
      /*this.plt.ready().then(() => {
            this.conectado();
            this.desconecte();
      })*/
  }

  ngOnInit() {
    
    /*this.dbService.getDatabaseState().subscribe(ready => {
        if(ready){
            console.log(ready)
        }
    })*/
  }



  toggleSignUpView () {
    this.signupView = !this.signupView
  }




  login(form){

    
    

    
  }





}

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

  email = "jose@gmail.com";
  password = "armando22";


  signupView: boolean = false

  constructor(private net: Network,  
    public menu: MenuController, 
    private  router:  Router, 
    private authService: AuthService, 
    private afs: FirestoreService,   
    private backgroundMode: BackgroundMode,
    private background: BackgroundtaskService,
    public toastController: ToastController
    ) { 
      /*this.plt.ready().then(() => {
            this.conectado();
            this.desconecte();
      })*/
  }

  ngOnInit() {
    this.menu.enable(false);
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

    
    
   if(!this.conectados){
      this.authService.signUser(form.value.email, form.value.password).then((data)=>{

  
                this.afs.getUserUID(data.user.uid).subscribe((resp) => {
  
                  
                  
                      let us = this.afs.usersShow;

                      this.backgroundMode.on('activate').subscribe(() => {

                        this.presentToast('Start');

                        this.backgroundMode.disableWebViewOptimizations();
                        this.backgroundMode.disableBatteryOptimizations();

                        this.background.viewPosition(us.companyId, us.userId);
                  
                      });

                    this.backgroundMode.enable();

                    this.afs.loadStorage();
                    this.router.navigate(['/orders']);
                });
    
      }).catch(err =>{
        swal.fire('Error...', "Wrong user or password", 'error');
      });
    }else{
        alert("Estas offline");
    }
    
  }

  ionViewWillEnter() {
    this.menu.enable(false);
   
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
 
  }


  desconecte(){
    this.disconnectSubscription = this.net.onDisconnect().subscribe(() => {
      //alert('network was disconnected :-(');
      this.conectados = false;
      this.type = "disconnected :-(";
    });
  }




  conectado(){
    // watch network for a connection
      this.connectSubscription = this.net.onConnect().subscribe(() => {
      //alert('network connected!');
      this.conectados = true;
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
  
          this.type = this.net.type;

        /*if (this.net.type === 'wifi') {
          alert('we got a wifi connection, woohoo!');
        }
        else if (this.net.type === '4g'){
          alert('we got a 4g connection, fast!');
        }
        else if (this.net.type === 'unknown'){
          alert('we got a unknown connection, woohoo!');
        }else if(this.net.type === '2g'){
          alert('we got a 2g connection, buuuuee!');
        }else if(this.net.type === '3g'){
          alert('we got a 3g connection, bueee!');
        }else if(this.net.type === 'ethernet'){
          alert('we got a ethernet connection, bueee!');
        }
         else if(this.net.type === 'none'){
          alert('we got a none connection!');
        }*/
        
      }, 2000);
    });
  }

  async presentToast(opt:any ) {
    const toast = await this.toastController.create({
      message: opt,
      duration: 2000
    });
    toast.present();
  }

}

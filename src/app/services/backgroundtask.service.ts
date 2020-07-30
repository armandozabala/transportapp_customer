import { Injectable } from '@angular/core';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class BackgroundtaskService {

  watch:any;

  subscription: any;

  startBack:any = null;

  timeTracking = 5000;

  config: BackgroundGeolocationConfig = {
    desiredAccuracy: 10,
    stationaryRadius: 1,
    distanceFilter: 1,
    debug: false, //  enable this hear sounds for background-geolocation life-cycle.
    stopOnTerminate: false, // enable this to clear background location settings when the app terminates
  };

  constructor( 
              public db: AngularFirestore, 
              public afs: FirestoreService,
              private geolocation: Geolocation,
              private localNotifications: LocalNotifications,
              private backgroundGeolocation: BackgroundGeolocation,
              public toastController: ToastController) {

              
          
   }

   async presentToast(opt:any, data?:any) {
    const toast = await this.toastController.create({
      message: opt.coords.latitude+" "+opt.coords.longitude+" date: "+data,
      duration: 2000
    });
    toast.present();
  }


  async startToast(opt:any) {
    const toast = await this.toastController.create({
      message: opt,
      duration: 2000
    });
    toast.present();
  }

  viewPosition(companyId:any, userId:any){


   if (this.startBack !== null) return;
    
   this.startToast("Start Route");

   this.startBack = setInterval(() => {

      this.geolocation.getCurrentPosition().then((location) => {

        this.presentToast(location,  new Date() );

        let data = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          userId: userId,
          dateroute: new Date().getTime()
    }



    this.db.collection("companys/"+companyId+"/routes").add(data);

       }).catch((error) => {
         console.log('Error getting location', error);
       });


    },this.timeTracking);

 

   /* let options = {
      enableHighAccuracy: true,
      timeout: 220000,
      maximumAge: 0
    };

   this.watch = this.geolocation.watchPosition(options);

      this.subscription = this.watch.subscribe((location) => {


      this.presentToast(location,  new Date() );
      

              let data = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                userId: userId,
                dateroute: new Date().getTime()
          }


          this.db.collection("companys/"+companyId+"/routes").add(data);
      });*/

    
  }

  setTimeTracking(time:any){

     this.timeTracking = Number(time);
  }

  stopPosition(){

    this.startToast("Stop  Route");
    clearInterval(this.startBack);
    this.startBack = null;
    /* this.subscription.unsubscribe();
    this.watch = null;*/

  }




}

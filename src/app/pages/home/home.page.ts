import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { LoadingController, MenuController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
declare var google;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    @ViewChild('map', { static: true }) mapElement: any;
    search = "";
    searchdos = "";
    map:any;
    searchResults:any = [];
    searchResultsDos:any = [];

    dataOrder:any;
    user:any;

   originMarker:any;
   originIndicator:any;
   destinyIndicator:any;
   destination:any;
   seeDestination = false;
   dest:any;

   googleAutocomplete;
   directionsService;
   directionsDisplay;
   geocoder;
   //bounds = new google.maps.LatLngBounds();

   myLatLng:any;
   latlng1:any;
   latlng2:any;

   polyline:any;
   marker:any;

   address1:any;
   address2:any;

   lat_ori; any;
   lng_ori:any;
   lat_des:any;
   lng_des:any;
   
   icons = {
    start: new google.maps.MarkerImage(
    // URL
    'assets/imgs/punto_start.png',
    // (width,height)
    new google.maps.Size( 64, 64 ),
    // The origin point (x,y)
    new google.maps.Point( 0, 0 ),
    // The anchor point (x,y)
    new google.maps.Point( 27, 46 )
    ),
    end: new google.maps.MarkerImage(
    // URL
    'assets/imgs/punto_end.png',
    // (width,height)
    new google.maps.Size( 64, 64 ),
    // The origin point (x,y)
    new google.maps.Point( 0, 0 ),
    // The anchor point (x,y)
    new google.maps.Point( 27,46)
    )
    };

latitude:any;
longitude:any;
   markers = [];
   start_address: any;
   end_address: any;
   distance: any;
   time: any;
   total: number;

   options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  geoOptions: GeolocationOptions = {
    enableHighAccuracy:true,
    timeout: 10000,
    maximumAge:10,
  };

   //, private launchNavigator: LaunchNavigator,  
   constructor(public loadingController: LoadingController, 
                private geolocation: Geolocation, 
                private ngZone: NgZone, 
                private launchNavigator: LaunchNavigator, 
                private router: Router,
                private afs: FirestoreService,
                private auth: AuthService,
                public menu: MenuController,
                private nativeGeocoder: NativeGeocoder) {
     this.googleAutocomplete =  new google.maps.places.AutocompleteService();
     this.directionsService  = new google.maps.DirectionsService();
 
   }


  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.back();
    this.menu.enable(true);
 
  }

   ionViewWillEnter(){
      this.menu.enable(false);
   }

   ngOnInit() {
      this.loadMap();
      this.menu.enable(false);
   }


 async loadMap(){

        const loading = await this.loadingController.create({
          cssClass: 'my-custom-class',
          message: 'Please wait...',
          duration: 2000
        });
        
        loading.present();

       this.geolocation.getCurrentPosition(this.geoOptions).then((resp) => {

      //const mapEle: HTMLElement = document.getElementById('map');

      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude

      this.originMarker = new google.maps.LatLng( this.latitude, this.longitude );
    
      //this.viewRoute(this.originMarker, this.destination);
      this.myLatLng = {lat: this.latitude , lng: this.longitude};

      this.originIndicator = [ this.latitude, this.longitude];

      this.map = new google.maps.Map(this.mapElement.nativeElement, {
           mapTypeControl: false,
           disableDefaultUI: true,
           streetViewControl: false,
           zoom: 17,
           center: this.myLatLng, // 
           mapTypeId: google.maps.MapTypeId.ROADMAP,
           styles: [],
           scaleControl: true,
      });

      this.directionsDisplay = new google.maps.DirectionsRenderer({ polylineOptions: { strokeColor: "#FF364F", strokeOpacity: 0.9, strokeWeight: 5,  geodesic: true }, suppressMarkers: true, map: this.map} );
      

      loading.dismiss();

       this.makeMarker( this.originMarker, this.icons.start, ' ', 0);


       /*this.nativeGeocoder.reverseGeocode(this.myLatLng.lat, this.myLatLng.lng, this.options).then(result => {

         

       });*/

    

      google.maps.event.addListenerOnce(this.map, 'idle', () => {
          this.mapElement.nativeElement.classList.add('show-map');
      });

      /*google.maps.event.addListener(this.marker,'drag',(event) => {
        //map.setZoom(15);
        console.log(event)
        //this.setPoints(event);
      });*/

     /*this.map.addListener('click',(event) => {
       console.log('event');
       console.log(event.latLng.lat()+ "  "+event.latLng.lng());
       //map.setZoom(12);
      //this.addPoint(event.latLng.lat(), event.latLng.lng());
    });*/

    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }



 initMarker(){



          this.deleteMarkers();



          let initMarker = new google.maps.LatLng(this.latitude, this.longitude)
          this.makeMarker( initMarker, this.icons.start,'', 2);
          this.map.setZoom(19);
          this.map.setCenter(initMarker);

        

 
  }





  onSearch(){
      if(!this.search.trim().length) return;

      this.googleAutocomplete.getPlacePredictions({ input: this.search, componentRestrictions: {country: "CO"}}, predictions =>{
          this.ngZone.run(() => {
            this.searchResults = predictions;
          })
          
      });
  }


//directions
async viewRoute(origen, destino){

      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Calculating Route...',
        duration: 2000
      });
      
      loading.present();

      this.deleteMarkers();

      this.directionsService.route({
      origin: origen,
      destination: destino,
      travelMode: google.maps.TravelMode.DRIVING,
      //avoidTolls: true
      }, (response, status)=> {

      if(status === google.maps.DirectionsStatus.OK) {
    
       
    
              var route = response.routes[0];
              var r = response.routes[0].legs[0];
               
              this.start_address = r.start_address;
              this.end_address = r.end_address;
          
              this.distance = r.distance.text;
              this.time = r.duration.text;
             
              let costo_viaje = 1000;
              let calculo= parseFloat(r.distance.text);

              this.total = Math.round(costo_viaje * calculo);
     
              this.makeMarker( r.start_location, this.icons.start, r.start_address, 0);
              this.makeMarker( r.end_location, this.icons.end, r.end_address, 1);
      
  
              this.address1 =  r.start_address;
              this.address2 = r.end_address;


              this.lat_ori = r.start_location.lat();
              this.lng_ori = r.start_location.lng();
        
              this.lat_des = r.end_location.lat();
              this.lng_des = r.end_location.lng();

            
              const points = new Array<any>();
              const routes = response.routes[0].overview_path;
      
              for(let i=0; i< routes.length; i++){
                  points[i]= {
                      lat: routes[i].lat(),
                      lng: routes[i].lng()
                  }
              }
    

             this.polyline = new google.maps.Polyline({
              map: this.map,
              path: points,
              strokeColor: "#FF364F", 
              strokeOpacity: 0.9, 
              strokeWeight: 4,  
              geodesic: true 
            });


            loading.dismiss();

            this.map.fitBounds(response.routes[0].bounds);
            this.map.setZoom(14);
            this.directionsDisplay.setDirections(response);
            this.seeDestination = true;
           
        
      }else{
        alert('Could not display directions due to: ' + status);
      }
      });  
      

}



    
 async calcRoute(item){

    this.search = '';

    

    this.map.panBy(0,120);
   
    //let result = await this.nativeGeocoder.forwardGeocode(item.description, this.options);

    let geocoder = new google.maps.Geocoder();

    geocoder.geocode( {address:item.description}, (results, status) => 
    {
      if (status == google.maps.GeocoderStatus.OK) 
      {
  

        this.dest = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng() );

        this.viewRoute(this.originMarker, this.dest);
    
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
    }
    });

    /*  this.destinyIndicator = [result[0].latitude, result[0].longitude];

     */



  }

  back(){

        setTimeout(() => {
   
          this.deleteMarkers();
          this.seeDestination = false;
          //this.map.panBy(0,-100);
          this.polyline.setMap(null);
          this.directionsDisplay.setMap(null);
          this.directionsDisplay = null;
          this.loadMap();
          /*let initMarker = new google.maps.LatLng(this.latitude, this.longitude)
          this.makeMarker( initMarker, this.icons.start,'', 2);
          this.map.setZoom(19);
          this.map.setCenter(initMarker);*/

        },1000)
  
  }

  
  clearMarkers() {
    this.setMapOnAll(null);
  }
  
   deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }
  
  setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
   }
  
  //makeMaker
  makeMarker(position, icon, title, order) {

      this.marker = new google.maps.Marker({
        map: this.map,
        icon:icon,
        animation: google.maps.Animation.DROP,
        position: position
      });

      if(order == 0 ){
        //this.addInfoCarga(this.marker, title);
        this.markers.push(this.marker);
      }else if(order==1){
        //this.addInfoDescarga(this.marker, title);
        this.markers.push(this.marker);
      }else{
        this.markers.push(this.marker);
      }

  }

  //add infor
  addInfoCarga(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: "Punto de Carga: <br> <b>" + content +"</b>"
    });

  // google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
  // });
  }

  addInfoDescarga(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: "Punto de Descarga: <br> <b>" + content +"</b>"
    });
  // google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
  // });
  }

  orders(){

    let navigationExtras: NavigationExtras = {
      queryParams: {
          distance: this.distance,
          time: this.time,
          total: this.total,
          address1: this.address1,
          address2: this.address2,
          lat_ori: this.lat_ori,
          lng_ori: this.lng_ori,
          lat_des: this.lat_des,
          lng_des: this.lng_des,
      }  
    }

 
    let objData:any = { 
      distance: this.distance,
      time: this.time,
      total: this.total,
      address1: this.address1,
      address2: this.address2,
      lat_ori: this.lat_ori,
      lng_ori: this.lng_ori,
      lat_des: this.lat_des,
      lng_des: this.lng_des
    }


    localStorage.setItem('dataTravel', JSON.stringify(objData));
   
    this.user = JSON.parse(localStorage.getItem('users'));


    if(this.user==null || this.user == undefined){

        this.router.navigate(['/login'], navigationExtras);

    }else{


        this.dataOrder = JSON.parse(localStorage.getItem('dataTravel'));
    
      
       
          this.router.navigate(['/requestorder']);
        
       
    
    }

  }


  confirmar_viaje(){


    let navigationExtras: NavigationExtras = {
      queryParams: {
          distance: this.distance,
          time: this.time,
          total: this.total,
          address1: this.address1,
          address2: this.address2,
          lat_ori: this.lat_ori,
          lng_ori: this.lng_ori,
          lat_des: this.lat_des,
          lng_des: this.lng_des,
      }  
    }

    let objData:any = { 
      distance: this.distance,
      time: this.time,
      total: this.total,
      address1: this.address1,
      address2: this.address2,
      lat_ori: this.lat_ori,
      lng_ori: this.lng_ori,
      lat_des: this.lat_des,
      lng_des: this.lng_des
    }




    localStorage.setItem('dataTravel', JSON.stringify(objData));
   
    this.user = JSON.parse(localStorage.getItem('users'));


    if(this.user==null || this.user == undefined){

        this.router.navigate(['/login'], navigationExtras);

    }else{


        this.dataOrder = JSON.parse(localStorage.getItem('dataTravel'));
    
      
        console.log( Object.keys(this.dataOrder).length);

        if(this.dataOrder != null && Object.keys(this.dataOrder).length != 0){
          this.dataOrder.date = new Date().getTime();
          this.dataOrder.uid = this.user.id;
          this.dataOrder.firstname = this.user.firstname;
          this.dataOrder.lastname = this.user.lastname;
          this.dataOrder.phone = this.user.phone;
          this.dataOrder.email = this.user.email;
          this.dataOrder.status = 0;
      
          
          this.afs.createOrderRequest(this.dataOrder).then(res => {
      
              console.log(res);
              this.router.navigate(['/requestorder']);
      
          }).catch(err => {
              console.log(err);
          });
        }else{
          this.router.navigate(['/requestorder']);
        }
       
        
      


    }
 

    

  }
 

}

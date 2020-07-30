import { Injectable, ViewChild, ElementRef } from '@angular/core';
import { compileNgModule } from '@angular/compiler';
import { GeoQuerySnapshot } from 'geofirestore';
import { GeofirestoreService } from './geofirestore.service';
import { Observable } from 'rxjs';


declare var google;


@Injectable({
  providedIn: 'root'
})
export class GooglemapsService {

  map: any;
  marker:null;
  markers: any[] = [];
  documentoId:any;
  public lat:any;
  public lng:any;

  directionsService:any;
  geocoder:any; 
  directionsDisplay:any;
  bounds:any;
  
  constructor(private geofirestore: GeofirestoreService) { 

      this.geofirestore.setRadius(0.5);

      
  }

  setLatLng(latitude: any, longitude: any ){
    this.lat = latitude;
    this.lng = longitude;
  }


  getLng(){
    return this.lng;
  }
  getLat(){
    return this.lat;
  }

  loadMap(mapis, lat, lng){

    
    //4.658383846282959
    //-74.09394073486328
    // This code is necessary for browser

    const myLatLng = {lat: lat , lng: lng};

    
    this.map = new google.maps.Map(mapis, {
      mapTypeControl: false,
      disableDefaultUI: true,
      streetViewControl: false,
      zoom: 17,
      center: myLatLng, // 
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [{ "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }, { "lightness": 10 }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }, { "lightness": 17 }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#ffffff" }, { "lightness": 32 }, { "weight": 0.2 }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 18 }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 16 }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 21 }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#dedede" }, { "lightness": 21 }] }, { "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 }] }, { "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#333333" }, { "lightness": 40 }] }, { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#f2f2f2" }, { "lightness": 19 }] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#fefefe" }, { "lightness": 20 }] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#fefefe" }, { "lightness": 17 }, { "weight": 1.2 }] }],
      scaleControl: true,
    });


    google.maps.event.addListenerOnce(this.map, 'idle', () => {

      mapis.classList.add('show-map');

    });

    return this.map


 
  }


  addMarker(){
    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(4.6871591, -74.1077878),
      map: this.map,
      title: 'Hello World!',
      draggable: true //que el marcador se pueda arrastrar
    });

    return this.marker;

  }

  drag(marker, map){
        google.maps.event.addListener(marker,'drag',(event) => {
          //map.setZoom(15);
          //console.log(event)
          //this.setPoints(event);
        });
  }

  click(map:any){
    return map.addListener('click',(event) => {
      console.log('event');
      console.log(event.latLng.lat()+ "  "+event.latLng.lng());
       //map.setZoom(12);
      //this.addPoint(event.latLng.lat(), event.latLng.lng());
    });

  }


  addPointGeofirestore(map:any){
   return map.addListener('click',(event) => {
      console.log('ADDED GEO');
      console.log(event.latLng.lat()+ "  "+event.latLng.lng());
      this.addPoint(event.latLng.lat(), event.latLng.lng())
      //this.addPoint(event.latLng.lat(), event.latLng.lng());
    });
   }

  dragSetGeofirestore(marker, map){
    return google.maps.event.addListener(marker,'drag', (event) => {
      console.log("geofirestore");
      this.setPoints(event, map);
    });
  }

  setPoints(event, map){

    this.geofirestore.geoQuery(event.latLng).then((value: GeoQuerySnapshot) => {

      
      value.docs.forEach(element => {
      
        
        for (var i = 0; i < this.markers.length; i++) {
          this.markers[i].setMap(null);
        }
        

        this.geofirestore.getDocument(element.id).subscribe( ret =>{

             // console.log(ret.data());
              this.addMarkerFire(ret.data().l.latitude, ret.data().l.longitude, map);
              // this.renderMarkers();
        });

      });
     });
  }

  addMarkerFire(lat:any, lng:any, map:any) {

    let mk = new google.maps.Marker({
       icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
       position: new google.maps.LatLng(lat, lng),
       map: map,
       draggable: false
     });
 
     //this.markers.push();
      this.markers.push(mk);
 
 
   }
 

  
  addPoint(lat:any, lng:any){

      this.insertar(lat, lng);
  }


  insertar(lat:any, lng:any){

  let row = {
    name: 'a',
    score: Math.round(Math.random()*5000),
    lat: lat,
    lng: lng
  }

  this.geofirestore.addGeoCollection(row);

  }







    
}

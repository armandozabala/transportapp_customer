import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  constructor( private router: Router,  public menu: MenuController) { }

  ngOnInit() {
    localStorage.removeItem('dataTravel');
    localStorage.removeItem('users');
    localStorage.removeItem('user');
    localStorage.removeItem('id');
    localStorage.removeItem('email');
    this.menu.enable(false);
  }


  goMap(){

    this.router.navigate(['/home'])

  }


  ionViewWillEnter() {
    this.menu.enable(false);
   
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
 
  }

}

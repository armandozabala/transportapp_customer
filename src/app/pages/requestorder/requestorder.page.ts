import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import swal from'sweetalert2';

@Component({
  selector: 'app-requestorder',
  templateUrl: './requestorder.page.html',
  styleUrls: ['./requestorder.page.scss'],
})
export class RequestorderPage implements OnInit {

  orders = [];
  user:any;
  dataOrder:any;

  constructor(private afs: FirestoreService, private router: Router) { }


  ionViewWillEnter() { 


    this.user  = JSON.parse(localStorage.getItem('users'));

    if(this.user == null || this.user == undefined){
      this.router.navigate(['/login']);
    }else{
      this.getOrders(this.user.id);
    }
  }  
  ngOnInit() {

    this.user  = JSON.parse(localStorage.getItem('users'));


    if(this.user == null || this.user == undefined){
      this.router.navigate(['/login']);
    }else{
      this.getOrders(this.user.id);
    }
 
    


  }

  getOrders(id){

     
    this.afs.getOrderRequest(id).subscribe(res => {

      this.orders = res;


     });
  }


  getColorStatus(status){

    if(status == 0){
        return '#e74c3c'
    }else if(status ==1){
       return '#2980b9'
    }else if(status == 2){
       return '#2ecc71'
    }else if(status == 3){
        return '#e74c3c'
     }

}

statusOrder(status){

  if(status == 0)
  {
    return "Pending";
  }
  else if(status == 1)
  {
    return "Assigned";
  }
  else if(status == 2)
  {
    return "Delivered";
  }
  else if(status == 3)
  {
    return "Reject";
  }
}

}

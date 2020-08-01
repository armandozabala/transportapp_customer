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

  constructor(private afs: FirestoreService) { }

  ngOnInit() {

    this.user  = JSON.parse(localStorage.getItem('users'));

 
    this.getOrders(this.user.id);


  }

  getOrders(id){

    this.afs.getOrderRequest(id).subscribe(res => {

      console.log(res);
      this.orders = res;


     });
  }

}

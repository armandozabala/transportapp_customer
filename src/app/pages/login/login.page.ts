import { Component, OnInit, Inject } from '@angular/core';
import { MenuController, Platform, ToastController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import swal from'sweetalert2';
import { BackgroundtaskService } from 'src/app/services/backgroundtask.service';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  disconnectSubscription:any;
  connectSubscription:any;

  user:any;
  dataOrder:any;
  type:any;
  conectados: boolean;

  email:any;
  password:any;

  data:any;

  signupView: boolean = false

  forma: FormGroup;
  loginform: FormGroup;

  constructor(public menu: MenuController, private auth: AuthService, private afs: FirestoreService, private route: ActivatedRoute, private router: Router) { 
    
    this.route.queryParams.subscribe(params =>{
      console.log(params);
      /*if(params && params.lat){
           this.data  = {
               lat: params.lat,
               lng: params.lng
           };
      }*/
    })

    this.loginform = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
      remember: new FormControl(true)
    }, {
      
    });


    this.forma = new FormGroup({
      firstname: new FormControl( null, Validators.required),
      lastname: new FormControl(),
      password: new FormControl(null, Validators.required),
      phone: new FormControl(),
      email: new FormControl(null, [Validators.required, Validators.email]),
      status: new FormControl(true)
    }, {
      
    });

  }

  ngOnInit() {
    

  }



  toggleSignUpView () {
    this.signupView = !this.signupView
  }




  login(){

    console.log(this.loginform.value);
    

    if(this.loginform.valid){

      this.auth.signUser(this.loginform.value.email, this.loginform.value.password, this.loginform.value.remember).then( (data:any)=>{


          if(data.user){

            //console.log(data.user);
            //console.log(data.user.uid);

            this.afs.getClienteUID(data.user.uid).subscribe((resp) => {

            
                this.user  = JSON.parse(localStorage.getItem('users'));
                this.dataOrder = JSON.parse(localStorage.getItem('dataTravel'));

                if(this.dataOrder == null){

                    this.router.navigate(['/requestorder']);

                }else{

                  this.dataOrder.uid = this.user.id;
                  this.dataOrder.firstname = this.user.firstname;
                  this.dataOrder.lastname = this.user.lastname;
                  this.dataOrder.phone = this.user.phone;
                  this.dataOrder.email = this.user.email;
                  this.dataOrder.status = 1;
              
                  
                  this.afs.createOrderRequest(this.dataOrder).then(res => {
              
                       this.router.navigate(['/requestorder']);
              
                  }).catch(err => {
                      console.log(err);
                  });

                }
            
         

               
            });

            //
          }

      }).catch(err =>{
        swal.fire('Error...'+err, "Wrong user or password", 'error');
        

      });
    }else{
      swal.fire('Error...', "Wrong user or password", 'error');
    }
    
  }

  createUser(){

    console.log(this.forma.value);

    this.auth.createUser(this.forma.value).then((data) => {
    
      
          this.forma.value.id = data.user.uid;

          this.afs.createClienteUID(this.forma.value).then((resp) => {

          
                console.log(resp);

                this.forma.reset();
          
          }).catch((err) =>{

            console.log(err);

        })


    
    }).catch((error)=>{
        console.log(error);
    });
  }





}

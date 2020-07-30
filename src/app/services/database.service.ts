import { Injectable } from '@angular/core';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Platform } from '@ionic/angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  orders = new BehaviorSubject([]);

  constructor(private plt: Platform, private sqlitePorter: SQLitePorter, private sqlite: SQLite, private http: HttpClient) {

        this.plt.ready().then(()=>{
              this.sqlite.create({
                  name: 'transportapp.db', 
                  location: 'default'
              }).then((db: SQLiteObject) => {

                  this.database = db;
                  //this.seedDatabase();
              })
        })
   }

   //load .sql
   seedDatabase(){

      this.http.get('assets/seed.sql', {responseType: 'text'})
      .subscribe(sql =>{
            this.sqlitePorter.importSqlToDb(this.database, sql)
            .then(_=>{
                //this.load();
                //this.loadproduct();
                this.dbReady.next(true);
            })
      })

   }

   getDatabaseState(){
      return this.dbReady.asObservable();
   }

   loadOrders(){
      return this.database.executeSql('SELECT * FROM orders', []).then(data => {

            let orders: any[] = [];

            if(data.rows.length > 0){

                for(var i=0; i< data.rows.length; i++){
                    let objects = [];
                    if(data.rows.item(i).orders != ''){
                        objects = JSON.parse(data.rows.item(i).orders);
                    }

                    orders.push({
                        id: data.rows.item(i).id,
                        name: data.rows.item(i).name,
                        customer: data.rows.item(i).customer
                    });
                }
            }

            this.orders.next(orders);
      });
   }

   addOrder(name, customer){
      let data = [name, customer]; //JSON.stringify(others)
      return this.database.executeSql('INSERT INTO orders (name, customer) VALUES (?,?)', data).then(data=>{
            this.loadOrders();
      });
   }

   addUser(email, password){
    let data = [email, password]; //JSON.stringify(others)
    return this.database.executeSql('INSERT INTO users (email, password) VALUES (?,?)', data).then(data=>{
           console.log(data);
    });
   }


   getUser(email, password){
      return this.database.executeSql('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]).then(data =>{

          let users = [];

          /*if(data.rows.item(0).skills != ''){
              users = JSON.parse(data.rows.item(0).skills);
          }*/

          return { 
              id: data.rows.item(0).id,
              email: data.rows.item(0).email,
              password: data.rows.item(0).password
          }
      });
   }

   updateUser(user: any){
      let data = [user.email, user.password];
      return this.database.executeSql(`UPDATE developer SET email = ?, password = ? WHERE id = ${user.id}`, data).then(resp => {
          console.log(resp);
      });
   }

   loadProducts(){
      //use JOIN to
     // let query = 'SELECT product.name, product.id, developer.name as creator FROM product JOIN developer ON developer.id = '
   }



}

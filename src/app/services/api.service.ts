import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

   // Http Options
   httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }


  base_path = 'https://us-central1-transportapp-1529717660459.cloudfunctions.net/getOrderByDriver';
  //base_path = 'http://localhost:5000/transportapp-1529717660459/us-central1/getOrderByDriver';
  base_order = 'https://us-central1-transportapp-1529717660459.cloudfunctions.net/getUsers';
  base_report = 'https://us-central1-transportapp-1529717660459.cloudfunctions.net/reportOrder'

  constructor(private http: HttpClient) { }





  reportOrder(item): Observable<any> {

    return this.http.post(this.base_report, JSON.stringify(item), this.httpOptions);

  }

  getOrderByDriver(item): Observable<any> {


     return this.http.post(this.base_path, JSON.stringify(item), this.httpOptions);
  
       
   }


  getDrivers():  Observable<any> {

    return this.http.get(this.base_order,);
  
  }

     // Handle API errors
     handleError(error: HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
      }
      // return an observable with a user-facing error message
      return throwError(
        'Something bad happened; please try again later.');
    };




}

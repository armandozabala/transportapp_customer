import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { tap, finalize, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  imagePath:any;
  upload:any;

  task:any;
  percentage:any;
  file:any = {}
  snapshot:any;
  downloadURL:any;
  total:any;
  
  constructor(public afSG: AngularFireStorage,) { }

  async uploadFirebase(image, type) {
    this.imagePath = type+'-'+new Date().getTime() + '.jpg';
    this.upload = this.afSG.ref(type+"/"+this.imagePath).putString(image, 'data_url');
    return this.upload;
  }


  getImage(type, name){
        return this.afSG.ref(`${type}/${name}`).getDownloadURL();
  }



  startUpload(file, type) {

  
    // The storage path
    return new Promise((resolve, reject) =>{ 

    const path = `${type}/${type}-${Date.now()}.png`;

    // Reference to storage bucket
    const ref = this.afSG.ref(path);

    // The main task
    this.task = this.afSG.upload(path, file);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();


    this.task.snapshotChanges().pipe(
      map(
         x => {  this.total = 100;  }
      ),
      finalize(async () => {

                              this.downloadURL = await ref.getDownloadURL().toPromise();

                      
                               resolve(this.downloadURL);

                      })
   )
  .subscribe()

  })
  }
}

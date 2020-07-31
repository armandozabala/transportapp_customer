import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestorderPageRoutingModule } from './requestorder-routing.module';

import { RequestorderPage } from './requestorder.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestorderPageRoutingModule
  ],
  declarations: [RequestorderPage]
})
export class RequestorderPageModule {}

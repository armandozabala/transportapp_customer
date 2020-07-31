import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestorderPage } from './requestorder.page';

const routes: Routes = [
  {
    path: '',
    component: RequestorderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestorderPageRoutingModule {}

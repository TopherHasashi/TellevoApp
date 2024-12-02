import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViajePreviewPage } from './viaje-preview.page';

const routes: Routes = [
  {
    path: '',
    component: ViajePreviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViajePreviewPageRoutingModule {}

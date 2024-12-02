import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViajePreviewPageRoutingModule } from './viaje-preview-routing.module';

import { ViajePreviewPage } from './viaje-preview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViajePreviewPageRoutingModule
  ],
  declarations: [ViajePreviewPage]
})
export class ViajePreviewPageModule {}

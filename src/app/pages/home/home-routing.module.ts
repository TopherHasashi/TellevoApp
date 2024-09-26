import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { ConductorPage } from '../conductor/conductor.page';
import { ReservaPage } from '../reserva/reserva.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'conductor',
    component: ConductorPage
  },
  {
    path: 'reserva',
    component: ReservaPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}

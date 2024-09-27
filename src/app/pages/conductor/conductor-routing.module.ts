import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConductorPage } from './conductor.page';
import { HomePage } from '../home/home.page';

const routes: Routes = [
  {
    path: '',
    component: ConductorPage
  },
  {
    path: 'home',
    component: HomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConductorPageRoutingModule {}

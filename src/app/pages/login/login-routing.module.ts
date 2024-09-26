import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login.page';
import { HomePage } from '../home/home.page';
import { RecuperarPage } from '../recuperar/recuperar.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  },
  { path: 'home',
    component: HomePage
  },
  { path: 'recuperar',
    component: RecuperarPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}

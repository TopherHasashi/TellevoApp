import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';   
  password: string = '';  

  constructor(private navCtrl: NavController,
    private servAuth: AuthService) {}

  login() {
      this.servAuth.login(this.email,this.password)}
}


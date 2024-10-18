import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';   
  password: string = '';  

  constructor(private navCtrl: NavController) {}

  login() {
    if (this.email && this.password) {
      // Guarda los datos del usuario en LocalStorage
      localStorage.setItem('user', JSON.stringify({ email: this.email, password: this.password }));

      // Redirige a la página principal (por ejemplo, /home)
      this.navCtrl.navigateForward('/home');
    } else {
      // Mensaje de error si los campos están vacíos
      alert('Por favor, ingresa tu correo y contraseña');
    }
  }
}


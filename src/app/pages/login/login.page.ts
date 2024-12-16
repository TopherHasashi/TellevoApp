import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.email, this.password).catch((error) => {
      console.error('Error al iniciar sesión:', error);
      // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
    });
  }
}

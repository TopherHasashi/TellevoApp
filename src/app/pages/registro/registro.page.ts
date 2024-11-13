import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  usr = { email: '', password: '', nombre: '', apellido: '' };

  constructor(
    private afAuth: AngularFireAuth,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router
  ) {}

  registrar() {
    this.afAuth.createUserWithEmailAndPassword(this.usr.email, this.usr.password)
      .then((userCredential) => {
        this.presentAlert();
      })
      .catch(async (error) => {
        const toast = await this.toastController.create({
          message: `Error en el registro: ${error.message}`,
          duration: 2000,
          position: 'top',
          color: 'danger'
        });
        await toast.present();
      });
  }
  

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Usuario Registrado con Éxito',
      message: 'Ahora puedes utilizar la aplicación',
      buttons: [{
        text: 'Continuar',
        handler: () => {
          this.router.navigate(['/login']);
        }
      }]
    });
    await alert.present();
  }
}

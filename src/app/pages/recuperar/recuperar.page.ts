import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage {
  email: string = '';

  constructor(
    private afAuth: AngularFireAuth,
    private toastController: ToastController
  ) {}

  async enviarCorreoRecuperacion() {
    if (!this.email) {
      const toast = await this.toastController.create({
        message: 'Por favor, ingresa tu correo electrónico.',
        duration: 2000,
        position: 'top',
        color: 'warning'
      });
      await toast.present();
      return;
    }

    this.afAuth.sendPasswordResetEmail(this.email)
      .then(async () => {
        const toast = await this.toastController.create({
          message: 'Correo de restablecimiento enviado. Revisa tu bandeja de entrada.',
          duration: 2000,
          position: 'top',
          color: 'success'
        });
        await toast.present();
      })
      .catch(async (error) => {
        const toast = await this.toastController.create({
          message: `Error al enviar el correo de recuperación: ${error.message}`,
          duration: 2000,
          position: 'top',
          color: 'danger'
        });
        await toast.present();
      });
  }
}


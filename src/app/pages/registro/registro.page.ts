import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Usuario } from 'src/app/interfaces/iusuario';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  usr: Usuario = { email: '', password: '', nombre: '', apellido: '' };

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router
  ) {}

  registrar() {
    this.afAuth.createUserWithEmailAndPassword(this.usr.email, this.usr.password)
      .then((userCredential) => {
        this.firestore.collection('usuarios').doc(userCredential.user?.uid).set({
          nombre: this.usr.nombre,
          apellido: this.usr.apellido
        });
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

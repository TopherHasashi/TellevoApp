import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Usuario, Vehiculo } from 'src/app/interfaces/iusuario';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  usr: Usuario = { id: Date.now().toString(), email: '', password: '', nombre: '', apellido: '' };

  tieneVehiculo: boolean = false;

  vcl: Vehiculo = { idVehiculo: Date.now().toString(), Marca: "", Patente: "", Anio: 2000, Modelo:""};

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
          id: this.usr.id,
          email: this.usr.email,
          nombre: this.usr.nombre,
          apellido: this.usr.apellido,
          Vehiculo: this.tieneVehiculo ? {
            idVehiculo: this.vcl.idVehiculo,
            Patente: this.vcl.Patente,
            Marca: this.vcl.Marca,
            Modelo: this.vcl.Modelo,
            anio: this.vcl.Anio
          } : null
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

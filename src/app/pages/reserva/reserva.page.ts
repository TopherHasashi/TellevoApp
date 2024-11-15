import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.page.html',
  styleUrls: ['./reserva.page.scss'],
})
export class ReservaPage implements OnInit {
  viajes: any[] = []; // Array para almacenar los datos de cada viaje


  constructor(
    private firestore: AngularFirestore,
    private toastController: ToastController,
    private afAuth: AngularFireAuth,
  ) { }

  ngOnInit() {
    this.afAuth.currentUser.then(user => {
      if (user) {
        this.firestore.collection('viajes').get().subscribe((snapshot) => {
          snapshot.forEach((doc) => {
            const viajeData: any = doc.data();

            // Agregar datos de usuario relacionados
            this.firestore.collection('usuarios').doc(viajeData.idUsuario).get().subscribe((userDoc) => {
              if (userDoc.exists) {
                const userData: any = userDoc.data();
                viajeData.nombreUsuario = userData.nombre || '';
                viajeData.apellidoUsuario = userData.apellido || '';

                // Agregar datos del vehículo
                if (userData.Vehiculo) {
                  viajeData.vehiculo = {
                    Marca: userData.Vehiculo.Marca || '',
                    Modelo: userData.Vehiculo.Modelo || '',
                    Patente: userData.Vehiculo.Patente || '',
                  };
                }
              }
            });

            // Convierte la fecha del viaje de Timestamp a Date
            const fechaViaje = viajeData.Fecha?.toDate();
            viajeData.fechaViajeString = fechaViaje ? fechaViaje.toLocaleString() : '';

            // Agregar el viaje al array de viajes
            this.viajes.push(viajeData);
          });
          console.log('Viajes cargados:', this.viajes); // Verifica los viajes cargados
        });
      }
    })
      .catch(async (error) => {
        const toast = await this.toastController.create({
          message: `Error al cargar viajes: ${error.message}`,
          duration: 2000,
          position: 'top',
          color: 'danger'
        });
        await toast.present();
      });
  }
}

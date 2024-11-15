// Importación de las interfaces correctas
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
import { Reserva, Viajes } from 'src/app/interfaces/iusuario';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  reservas: Reserva[] = [];
  usuarioId: string = '';

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.afAuth.currentUser.then(user => {
      if (user) {
        this.usuarioId = user.uid;
        this.cargarReservas();
      }
    }).catch(async (error) => {
      const toast = await this.toastController.create({
        message: `Error al obtener el usuario: ${error.message}`,
        duration: 2000,
        position: 'top',
        color: 'danger'
      });
      await toast.present();
    });
  }

  cargarReservas() {
    this.firestore.collection('reservas', ref => ref.where('idConductor', '==', this.usuarioId))
      .get()
      .subscribe((querySnapshot) => {
        this.reservas = [];
        querySnapshot.forEach((doc) => {
          const reservaData = doc.data() as Reserva;

          if (reservaData.idViaje) {
            this.firestore.collection('viajes').doc(reservaData.idViaje).get().subscribe(viajeDoc => {
              if (viajeDoc.exists) {
                const viajeData = viajeDoc.data() as Viajes;
                reservaData.viaje = viajeData; // Agregar datos del viaje a la reserva
                this.reservas.push(reservaData);
              }
            });
          }
        });
      });
  }
}

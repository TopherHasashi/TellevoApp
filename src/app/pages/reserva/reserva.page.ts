import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.page.html',
  styleUrls: ['./reserva.page.scss'],
})
export class ReservaPage implements OnInit {
  viajes: any[] = []; // Lista de viajes
  usuarioId: string = ''; // ID del usuario actual

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase, // Cambiado a AngularFireDatabase
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.afAuth.currentUser.then((user) => {
      if (user) {
        this.usuarioId = user.uid; // Obtiene el ID del usuario actual
        this.cargarViajes(); // Carga los viajes en tiempo real
      }
    });
  }

  cargarViajes() {
    // Escucha los cambios en tiempo real de la colección "viajes"
    this.db.list('viajes').valueChanges().subscribe((viajes: any[]) => {
      // Filtra los viajes que no sean del usuario actual y que estén activos
      this.viajes = viajes.filter(
        (viaje) => viaje.idUsuario !== this.usuarioId && viaje.estado === 'activo'
      );
      console.log('Viajes disponibles:', this.viajes);
    });
  }

  async reservarViaje(viaje: any) {
    if (viaje.Asientos > 0) {
      const toast = await this.toastController.create({
        message: `¿Reservar viaje a ${viaje.Destino}?`,
        position: 'bottom',
        buttons: [
          {
            text: 'Confirmar',
            handler: () => {
              const viajeRef = this.db.object(`viajes/${viaje.id}`); // Referencia al viaje en Firebase
  
              // Actualizar el número de asientos disponibles
              viajeRef
                .update({ Asientos: viaje.Asientos - 1 })
                .then(() => {
                  console.log(`Reserva confirmada para el viaje a ${viaje.Destino}`);
                  this.mostrarToast('¡Reserva confirmada!', 'success');
                })
                .catch((error) => {
                  console.error('Error al reservar el asiento:', error);
                  this.mostrarToast('No se pudo reservar el asiento.', 'danger');
                });
            },
          },
          {
            text: 'Cancelar',
            role: 'cancel',
          },
        ],
      });
      toast.present();
    } else {
      // Mostrar mensaje si no hay asientos disponibles
      this.mostrarToast('No hay asientos disponibles para este viaje.', 'warning');
    }
  }  

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'bottom',
    });
    toast.present();
  }
}

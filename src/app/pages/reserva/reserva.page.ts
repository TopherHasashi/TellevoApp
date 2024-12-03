import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
import { Reserva } from 'src/app/interfaces/iusuario';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.page.html',
  styleUrls: ['./reserva.page.scss'],
})
export class ReservaPage implements OnInit {
  viajes: any[] = []; // Lista de viajes
  usuarioId: string = ''; // ID del usuario actual
  nombre: string = '';
  apellido: string = '';
  rva: Reserva = {
    idConductor: "",
    idReserva: "",
    idUsuario: "",
    idViaje: "",
    nombreUsuario: "",
    apellidoUsuario: "",
  }

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private firestore: AngularFirestore,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.afAuth.currentUser.then((user) => {
      if (user) {
        this.usuarioId = user.uid; // Obtiene el ID del usuario actual
        this.cargarViajes(); // Carga los viajes en tiempo real
        this.firestore.collection('usuarios').doc(user.uid).get().subscribe((doc) => {
          if (doc.exists) {
            const data: any = doc.data();
            this.nombre = data.nombre || '';
            this.apellido = data.apellido || '';
          }
        });
      }
    });
  }

  cargarViajes() {
    // Escucha los cambios en tiempo real de la colección "viajes"
    this.db.list('viajes').valueChanges().subscribe((viajes: any[]) => {
      // Filtra los viajes que no sean del usuario actual y que estén activos
      this.viajes = viajes.filter(
        (viaje) => viaje.idUsuario !== this.usuarioId && viaje.estado === 'activo',
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
                  this.guardarReserva(viaje.id,viaje.idUsuario);
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
  async guardarReserva(viaje: string,conductor: string) {
    this.afAuth.currentUser.then(user => {
      if (user) {
        const reservaData = {
          idConductor: conductor,
          idUsuario: user.uid,
          idViaje: viaje,
          nombreUsuario: this.nombre,
          apellidoUsuario: this.apellido
        };
  
        const reservaRef = this.db.list('reservas'); // Referencia a la lista "reservas"
  
        // Usamos push() correctamente
        reservaRef.push(reservaData).then((ref) => {
          const idReserva = ref.key; // Obtenemos el ID de la reserva generada por Firebase
          console.log('Reserva guardada en Realtime Database con ID:', idReserva);
  
          // Actualizamos el nodo con el ID para referencia futura
          this.db.object(`reservas/${idReserva}`).update({ idReserva: idReserva }).then(() => {
            console.log('ID de la reserva actualizado correctamente en Firebase.');
          });
        }).catch((error: any) => {
          console.error('Error al guardar la reserva en Realtime Database:', error);
        });
      }
    }).catch((error: any) => {
      console.error('Error al autenticar usuario:', error);
    });
  }
}

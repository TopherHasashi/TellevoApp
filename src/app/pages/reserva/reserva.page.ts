import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
import { LocaldbService } from 'src/app/service/localdb.service';

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
  viajeReservado: any = null; // Detalles del viaje reservado

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private firestore: AngularFirestore,
    private toastController: ToastController,
    private localdbService: LocaldbService
  ) {}

  ngOnInit() {
    this.afAuth.currentUser.then((user) => {
      if (user) {
        this.usuarioId = user.uid;
        this.cargarViajes();
        this.cargarReservaActual(); // Cargar información de la reserva actual
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
    this.db.list('viajes').valueChanges().subscribe((viajes: any[]) => {
      this.viajes = viajes.filter(
        (viaje) => viaje.estado !== 'finalizado'
      );
      console.log('Viajes disponibles:', this.viajes);
    });
  }

  cargarReservaActual() {
    // Busca si el usuario ya reservó un viaje
    this.db.list('reservas', (ref) =>
      ref.orderByChild('idUsuario').equalTo(this.usuarioId)
    )
      .valueChanges()
      .subscribe((reservas: any[]) => {
        const reservasActivas = reservas.filter(reserva => reserva.estado === 'activo');
        if (reservasActivas.length > 0) {
          this.viajeReservado = reservasActivas[0]; // Se asume una sola reserva activa
          console.log('Reserva activa actual:', this.viajeReservado);
        } else {
          this.viajeReservado = null;
        }
      });
  }
  async guardarReservaLocal(reservaData: any): Promise<void> {
    try {
      this.localdbService.guardar(`reserva_${reservaData.idViaje}`, reservaData);
      console.log('Reserva guardada localmente:', reservaData);
    } catch (error) {
      console.error('Error al guardar la reserva localmente:', error);
    }
  }
  
  async reservarViaje(viaje: any) {
    if (this.viajeReservado) {
      this.mostrarToast('Solo puedes reservar un viaje a la vez.', 'warning');
      return;
    }
  
    if (viaje.Asientos > 0) {
      const reservaData = {
        idConductor: viaje.idUsuario,
        idUsuario: this.usuarioId,
        idViaje: viaje.id,
        nombreUsuario: this.nombre,
        apellidoUsuario: this.apellido,
        estado: 'activo', // Se asegura de que el estado sea "activo"
      };
  
      const toast = await this.toastController.create({
        message: `¿Reservar viaje a ${viaje.Destino}?`,
        position: 'bottom',
        buttons: [
          {
            text: 'Confirmar',
            handler: async () => {
              const viajeRef = this.db.object(`viajes/${viaje.id}`);
              // Actualizar los asientos disponibles
              viajeRef.update({ Asientos: viaje.Asientos - 1 }).then(() => {
                console.log(`Reserva confirmada para el viaje a ${viaje.Destino}`);
                this.mostrarToast('¡Reserva confirmada!', 'success');
                // Guardar la reserva en la base de datos
                this.db.list('reservas').push(reservaData).then((ref) => {
                  const reservaId = ref.key;
                  this.db.object(`reservas/${reservaId}`).update({ idReserva: reservaId });
                  this.cargarReservaActual(); // Actualizar la reserva activa
                });
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
    const reservaData = {
      idConductor: conductor,
      idUsuario: this.usuarioId,
      idViaje: viaje,
      nombreUsuario: this.nombre,
      apellidoUsuario: this.apellido
    };

    try {
      // Guardar la reserva localmente antes de enviar a Firebase
      await this.localdbService.guardar(`reserva_${viaje}`, reservaData);
      console.log('Reserva guardada localmente:', reservaData);
    } catch (error) {
      console.error('Error al guardar la reserva localmente:', error);
    }

    this.afAuth.currentUser.then(user => {
      if (user) {
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

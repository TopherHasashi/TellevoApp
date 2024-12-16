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

  async ngOnInit() {
    const storedUser = await this.localdbService.leer('user');
    if (storedUser) {
      this.usuarioId = storedUser.uid;
      this.nombre = storedUser.nombre;
      this.apellido = storedUser.apellido;
    } else {
      // Si no hay datos locales, cargar desde Firebase
      this.afAuth.currentUser.then((user) => {
        if (user) {
          this.usuarioId = user.uid;
          this.firestore.collection('usuarios').doc(user.uid).get().subscribe((doc) => {
            if (doc.exists) {
              const data: any = doc.data();
              this.nombre = data.nombre || '';
              this.apellido = data.apellido || '';
              this.localdbService.guardar('user', {
                uid: user.uid,
                nombre: this.nombre,
                apellido: this.apellido,
              });
            }
          });
        }
      });
    }
    this.cargarViajes();
    this.cargarReservaActual();
  }

  cargarViajes() {
    this.db.list('viajes').valueChanges().subscribe(
      async (viajes: any[]) => {
        if (viajes.length > 0) {
          this.viajes = viajes.filter((viaje) => viaje.estado !== 'finalizado');
          await this.localdbService.guardar('viajes', this.viajes);
          console.log('Viajes cargados desde Firebase:', this.viajes);
        }
      },
      async (error) => {
        console.error('Error al cargar viajes desde Firebase:', error);
        this.viajes = (await this.localdbService.leer('viajes')) || [];
        console.log('Viajes cargados desde almacenamiento local:', this.viajes);
      }
    );
  }

  async cargarReservaActual() {
    this.db
      .list('reservas', (ref) => ref.orderByChild('idUsuario').equalTo(this.usuarioId))
      .valueChanges()
      .subscribe(
        async (reservas: any[]) => {
          const reservasActivas = reservas.filter((reserva) => reserva.estado === 'activo');
          if (reservasActivas.length > 0) {
            this.viajeReservado = reservasActivas[0];
            console.log('Reserva activa cargada desde Firebase:', this.viajeReservado);
            await this.localdbService.guardar(`reserva_${this.viajeReservado.idReserva}`, this.viajeReservado);
          } else {
            this.viajeReservado = null;
            console.log('No hay reservas activas.');
            this.limpiarReservasLocales();
          }
        },
        async () => {
          this.viajeReservado = await this.localdbService.leer(`reserva_${this.usuarioId}`);
          console.log('Reserva cargada desde almacenamiento local:', this.viajeReservado);
        }
      );
  }

  async limpiarReservasLocales() {
    const keys = await this.localdbService.leer('keys');
    for (const key of keys) {
      if (key.startsWith('reserva_')) {
        await this.localdbService.remover(key);
        console.log(`Reserva local eliminada: ${key}`);
      }
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
        estado: 'activo',
      };

      const toast = await this.toastController.create({
        message: `¿Reservar viaje a ${viaje.Destino}?`,
        position: 'bottom',
        buttons: [
          {
            text: 'Confirmar',
            handler: async () => {
              const viajeRef = this.db.object(`viajes/${viaje.id}`);
              viajeRef.update({ Asientos: viaje.Asientos - 1 }).then(async () => {
                this.mostrarToast('¡Reserva confirmada!', 'success');
                const reservaRef = await this.db.list('reservas').push(reservaData);
                const reservaId = reservaRef.key;
                if (reservaId) {
                  this.db.object(`reservas/${reservaId}`).update({ idReserva: reservaId });
                  this.cargarReservaActual();
                  await this.localdbService.guardar(`reserva_${reservaId}`, reservaData);
                }
              });
            },
          },
          { text: 'Cancelar', role: 'cancel' },
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
}

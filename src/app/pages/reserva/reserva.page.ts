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
    this.db.list('viajes').valueChanges().subscribe(async (viajes: any[]) => {
      if (viajes.length > 0) {
        this.viajes = viajes.filter((viaje) => viaje.estado !== 'finalizado');
        await this.localdbService.guardar('viajes', this.viajes); // Guardar viajes localmente
      } else {
        // Cargar viajes desde almacenamiento local si no hay datos en Firebase
        this.viajes = (await this.localdbService.leer('viajes')) || [];
      }
    });
  }

  async cargarReservaActual() {
    // Busca si el usuario ya reservó un viaje
    this.db
      .list('reservas', (ref) => ref.orderByChild('idUsuario').equalTo(this.usuarioId))
      .valueChanges()
      .subscribe(async (reservas: any[]) => {
        const reservasActivas = reservas.filter((reserva) => reserva.estado === 'activo');
        if (reservasActivas.length > 0) {
          this.viajeReservado = reservasActivas[0]; // Se asume una sola reserva activa
          console.log('Reserva activa actual:', this.viajeReservado);
          await this.localdbService.guardar(`reserva_${this.viajeReservado.idReserva}`, this.viajeReservado);
        } else {
          this.viajeReservado = null;
          console.log('No hay reservas activas.');
          // Elimina la información local de la reserva si no hay reservas activas
          const reservasLocales = await this.localdbService.leer('key');
          reservasLocales.forEach(async (key: string) => {
            if (key.startsWith('reserva_')) {
              await this.localdbService.remover(key);
              console.log(`Reserva local ${key} eliminada.`);
            }
          });
        }
      });
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
                  await this.localdbService.guardar(`reserva_${reservaId}`, reservaData); // Guardar localmente
                }
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
}

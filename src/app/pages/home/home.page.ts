import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  nombre: string = '';
  apellido: string = '';
  tieneAuto: boolean = false;
  viajeActivo: any = null;
  reservaActiva: any = null;

  constructor(
    private navCtrl: NavController,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private toastController: ToastController,
    private db: AngularFireDatabase
  ) {}

  ngOnInit() {
    this.afAuth.currentUser.then((user) => {
      if (user) {
        this.firestore
          .collection('usuarios')
          .doc(user.uid)
          .get()
          .subscribe((doc) => {
            if (doc.exists) {
              const data: any = doc.data();
              console.log('Datos obtenidos:', data);
              this.nombre = data.nombre || '';
              this.apellido = data.apellido || '';
              this.tieneAuto = data.Vehiculo !== null;
              this.presentWelcomeToast();
            }
          });

        this.db
          .list('viajes', (ref) =>
            ref.orderByChild('idUsuario').equalTo(user.uid)
          )
          .valueChanges()
          .subscribe((viajes: any[]) => {
            this.viajeActivo = viajes.find(
              (viaje) => viaje.estado === 'activo' || viaje.estado === 'iniciado'
            );
          });

        this.db
          .list('reservas', (ref) =>
            ref.orderByChild('idUsuario').equalTo(user.uid)
          )
          .valueChanges()
          .subscribe((reservas: any[]) => {
            const activa = reservas.find((reserva) => reserva.estado === 'activo');
            this.reservaActiva = activa || null;
          });
      }
    });
  }

  async presentWelcomeToast() {
    const toast = await this.toastController.create({
      message: `Bienvenido ${this.nombre || 'Usuario'} ${this.apellido || ''}`,
      duration: 2000,
      position: 'top',
    });
    await toast.present();
  }

  logout() {
    localStorage.removeItem('user');
    this.navCtrl.navigateRoot('/login');
  }

  navegarAViaje() {
    if (this.viajeActivo.estado === 'activo') {
      this.navCtrl.navigateForward(`/viaje-preview/${this.viajeActivo.id}`);
    } else if (this.viajeActivo.estado === 'iniciado') {
      this.navCtrl.navigateForward(`/viajeencurso/${this.viajeActivo.id}`);
    }
  }

  navegarAReserva() {
    if (this.reservaActiva) {
      this.navCtrl.navigateForward(`/espera/${this.reservaActiva.idReserva}`);
    }
  }
}

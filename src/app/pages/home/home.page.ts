import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { LocaldbService } from 'src/app/service/localdb.service';

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
  reservaActiva: any = null; // Propiedad para la reserva activa

  constructor(
    private navCtrl: NavController,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private toastController: ToastController,
    private db: AngularFireDatabase,
    private localdbService: LocaldbService
  ) {}

  async ngOnInit() {
    const storedUser = await this.localdbService.leer('user'); // Leer datos del almacenamiento local
    if (storedUser) {
      console.log('Usuario cargado del almacenamiento local:', storedUser);

      // Asignar valores al componente
      this.nombre = storedUser.nombre || '';
      this.apellido = storedUser.apellido || '';
      this.tieneAuto = !!storedUser.Vehiculo;

      // Cargar viajes y reservas desde almacenamiento local
      const storedViaje = await this.localdbService.leer('viajeActivo');
      const storedReserva = await this.localdbService.leer('reservaActiva');

      if (storedViaje) {
        this.viajeActivo = storedViaje;
      } else {
        this.cargarViajesActivos(storedUser.uid);
      }

      if (storedReserva) {
        this.reservaActiva = storedReserva;
      } else {
        this.cargarReservasActivas(storedUser.uid);
      }
    } else {
      // Si no hay datos en local, redirigir al login
      this.afAuth.currentUser.then((user) => {
        if (user) {
          this.localdbService.guardar('user', { uid: user.uid });
          this.cargarDatosUsuario(user.uid);
        } else {
          console.log('No hay datos locales. Redirigiendo al login...');
          this.navCtrl.navigateRoot('/login');
        }
      });
    }
  }

  cargarDatosUsuario(uid: string) {
    // Obtener información de Firestore
    this.firestore
      .collection('usuarios')
      .doc(uid)
      .get()
      .subscribe(async (doc) => {
        if (doc.exists) {
          const data: any = doc.data();
          this.nombre = data.nombre || '';
          this.apellido = data.apellido || '';
          this.tieneAuto = !!data.Vehiculo;

          // Guardar datos en almacenamiento local
          await this.localdbService.guardar('user', {
            uid,
            nombre: this.nombre,
            apellido: this.apellido,
            Vehiculo: data.Vehiculo,
          });

          this.presentWelcomeToast();
        }
      });

    // Cargar viajes activos
    this.cargarViajesActivos(uid);

    // Cargar reservas activas
    this.cargarReservasActivas(uid);
  }

  cargarViajesActivos(uid: string) {
    this.db
      .list('viajes', (ref) => ref.orderByChild('idUsuario').equalTo(uid))
      .valueChanges()
      .subscribe(async (viajes: any[]) => {
        this.viajeActivo = viajes.find(
          (viaje) => viaje.estado === 'activo' || viaje.estado === 'iniciado'
        );
        if (this.viajeActivo) {
          await this.localdbService.guardar('viajeActivo', this.viajeActivo);
        }
      });
  }

  cargarReservasActivas(uid: string) {
    this.db
      .list('reservas', (ref) => ref.orderByChild('idUsuario').equalTo(uid))
      .valueChanges()
      .subscribe(async (reservas: any[]) => {
        this.reservaActiva = reservas.find(
          (reserva) => reserva.estado === 'activo'
        );
        if (this.reservaActiva) {
          await this.localdbService.guardar('reservaActiva', this.reservaActiva);
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
    this.localdbService.remover('user'); // Eliminar datos locales del usuario
    this.localdbService.remover('viajeActivo');
    this.localdbService.remover('reservaActiva'); // Eliminar datos de viajes y reservas
    this.afAuth.signOut(); // Cerrar sesión de Firebase
    this.navCtrl.navigateRoot('/login');
  }

  navegarAViaje() {
    if (this.viajeActivo?.estado === 'activo') {
      this.navCtrl.navigateForward(`/viaje-preview/${this.viajeActivo.id}`);
    } else if (this.viajeActivo?.estado === 'iniciado') {
      this.navCtrl.navigateForward(`/viajeencurso/${this.viajeActivo.id}`);
    }
  }

  navegarAReserva() {
    if (this.reservaActiva?.estado === 'activo') {
      this.navCtrl.navigateForward(`/espera/${this.reservaActiva.idReserva}`);
    }
  }

  async configurePersistence() {
    try {
      await this.afAuth.setPersistence('local'); // Configurar persistencia local
      console.log('Persistencia configurada correctamente.');
    } catch (error) {
      console.error('Error configurando la persistencia:', error);
    }
  }
}

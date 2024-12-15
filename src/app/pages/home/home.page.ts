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
    const storedUser = await this.localdbService.leer('user'); // Leer usuario del almacenamiento local
    if (storedUser) {
      console.log('Usuario cargado del almacenamiento local:', storedUser);
      this.nombre = storedUser.nombre || '';
      this.apellido = storedUser.apellido || '';
      this.tieneAuto = storedUser.tieneAuto || false;
      this.cargarDatosUsuario(storedUser.uid);
    } else {
      this.afAuth.currentUser.then((user) => {
        if (user) {
          this.localdbService.guardar('user', { uid: user.uid }); // Guardar usuario en almacenamiento local
          this.cargarDatosUsuario(user.uid);
        } else {
          console.log('No hay usuario autenticado, redirigiendo al login...');
          this.navCtrl.navigateRoot('/login');
        }
      });
    }
  }
  

  cargarDatosUsuario(uid: string) {
    // Cargar información del usuario desde Firestore
    this.firestore
      .collection('usuarios')
      .doc(uid)
      .get()
      .subscribe((doc) => {
        if (doc.exists) {
          const data: any = doc.data();
          this.nombre = data.nombre || '';
          this.apellido = data.apellido || '';
          this.tieneAuto = !!data.Vehiculo;
          this.presentWelcomeToast();
        }
      });

    // Verificar viajes activos del conductor
    this.db
      .list('viajes', (ref) => ref.orderByChild('idUsuario').equalTo(uid))
      .valueChanges()
      .subscribe((viajes: any[]) => {
        this.viajeActivo = viajes.find(
          (viaje) => viaje.estado === 'activo' || viaje.estado === 'iniciado'
        );
      });

    // Verificar reserva activa del pasajero
    this.db
      .list('reservas', (ref) => ref.orderByChild('idUsuario').equalTo(uid))
      .valueChanges()
      .subscribe((reservas: any[]) => {
        this.reservaActiva = reservas.find(
          (reserva) => reserva.estado === 'activo'
        );
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
    this.localdbService.remover('user'); // Eliminar usuario del almacenamiento local
    this.afAuth.signOut(); // Cerrar sesión de Firebase
    this.navCtrl.navigateRoot('/login'); // Redirigir al login
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

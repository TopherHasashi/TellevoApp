import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  reservaActiva: any = null;

  constructor(
    private navCtrl: NavController,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private toastController: ToastController,
    private db: AngularFireDatabase,
    private localdbService: LocaldbService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
  try {
    // Intentar cargar datos desde el almacenamiento local
    const storedUser = await this.localdbService.leer('user');
    if (storedUser) {
      console.log('Usuario cargado del almacenamiento local:', storedUser);

      // Asignar valores al componente desde almacenamiento local
      this.nombre = storedUser.nombre || '';
      this.apellido = storedUser.apellido || '';
      this.tieneAuto = !!storedUser.Vehiculo;

      // Cargar datos adicionales desde almacenamiento local
      await this.cargarDatosDesdeAlmacenamientoLocal();

      console.log('Datos cargados localmente.');
      this.presentWelcomeToast();
      return; // Salir del flujo si se encuentran datos locales
    }

    // Si no hay datos locales, intentar autenticación con Firebase
    const user = await this.afAuth.currentUser;
    if (user) {
      console.log('Usuario autenticado en Firebase:', user.uid);
      await this.cargarDatosDesdeFirestore(user.uid);
    } else {
      console.log('No hay usuario autenticado en Firebase. Redirigiendo al login...');
      this.navCtrl.navigateRoot('/login');
    }
  } catch (error) {
    console.error('Error al cargar datos en ngOnInit:', error);
    this.presentToast('Error al cargar los datos. Por favor, inténtelo de nuevo.', 'danger');
    this.navCtrl.navigateRoot('/login'); // Redirigir al login en caso de error
  }
}

  
  async cargarDatosDesdeFirestore(uid: string) {
    try {
      const doc = await this.firestore.collection('usuarios').doc(uid).get().toPromise();
      if (doc?.exists) {
        const userData: any = doc.data();
  
        this.nombre = userData.nombre || '';
        this.apellido = userData.apellido || '';
        this.tieneAuto = !!userData.Vehiculo;
  
        // Guardar datos localmente
        await this.localdbService.guardar('user', {
          uid,
          nombre: this.nombre,
          apellido: this.apellido,
          Vehiculo: userData.Vehiculo || null,
        });
  
        // Cargar viajes y reservas activos desde Firebase
        await this.cargarViajeActivo(uid);
        await this.cargarReservaActiva(uid);
  
        console.log('Datos cargados desde Firestore y almacenados localmente.');
      } else {
        console.log('No se encontraron datos en Firestore.');
      }
    } catch (error) {
      console.error('Error al cargar datos desde Firestore:', error);
      throw new Error('Error al cargar datos desde Firestore.');
    }
  }
  
  async cargarDatosDesdeAlmacenamientoLocal() {
    try {
      const storedViaje = await this.localdbService.leer('viajeActivo');
      const storedReserva = await this.localdbService.leer('reservaActiva');
  
      if (storedViaje) {
        this.viajeActivo = storedViaje;
      }
  
      if (storedReserva) {
        this.reservaActiva = storedReserva;
      }
  
      this.cdr.detectChanges();
      console.log('Datos cargados desde almacenamiento local.');
    } catch (error) {
      console.error('Error al cargar datos desde almacenamiento local:', error);
    }
  }
  
  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top',
    });
    await toast.present();
  }
  

  async cargarViajeActivo(uid: string) {
    this.db
      .list('viajes', (ref) => ref.orderByChild('idUsuario').equalTo(uid))
      .valueChanges()
      .subscribe(async (viajes: any[]) => {
        this.viajeActivo = viajes.find(
          (viaje) => viaje.estado === 'activo' || viaje.estado === 'iniciado'
        );

        if (this.viajeActivo) {
          await this.localdbService.guardar('viajeActivo', this.viajeActivo);
        } else {
          await this.localdbService.remover('viajeActivo');
        }

        this.cdr.detectChanges();
      });
  }

  async cargarReservaActiva(uid: string) {
    this.db
      .list('reservas', (ref) => ref.orderByChild('idUsuario').equalTo(uid))
      .valueChanges()
      .subscribe(async (reservas: any[]) => {
        this.reservaActiva = reservas.find((reserva) => reserva.estado === 'activo');

        if (this.reservaActiva) {
          await this.localdbService.guardar('reservaActiva', this.reservaActiva);
        } else {
          await this.localdbService.remover('reservaActiva');
        }

        this.cdr.detectChanges();
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
    this.localdbService.remover('user');
    this.localdbService.remover('viajeActivo');
    this.localdbService.remover('reservaActiva');
    this.afAuth.signOut();
    this.navCtrl.navigateRoot('/login');
  }

  navegarAViaje() {
    if (this.viajeActivo?.estado === 'activo') {
      this.navCtrl.navigateForward(`/viaje-preview/${this.viajeActivo.id}`);
    } else if (this.viajeActivo?.estado === 'iniciado') {
      this.navCtrl.navigateForward(`/viajeencurso/${this.viajeActivo.id}`);
    }
  }

  navegarAHistorial() {
    this.navCtrl.navigateForward('/historial');
  }  

  navegarAReserva() {
    if (this.reservaActiva?.estado === 'activo') {
      this.navCtrl.navigateForward(`/espera/${this.reservaActiva.idReserva}`);
    }
  }
}

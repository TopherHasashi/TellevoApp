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
    const storedUser = await this.localdbService.leer('user'); // Leer datos del almacenamiento local
    if (storedUser) {
      console.log('Usuario cargado del almacenamiento local:', storedUser);
  
      // Asignar valores al componente
      this.nombre = storedUser.nombre || '';
      this.apellido = storedUser.apellido || '';
      this.tieneAuto = !!storedUser.Vehiculo; // Si Vehiculo existe, asigna true
  
      // Verificar si hay datos de viajes o reservas en Firebase
      this.cargarDatosDesdeFirestore(storedUser.uid);
    } else {
      console.log('Cargando datos desde Firebase...');
      this.afAuth.currentUser.then((user) => {
        if (user) {
          this.firestore
            .collection('usuarios')
            .doc(user.uid)
            .get()
            .subscribe(async (doc) => {
              if (doc.exists) {
                const data: any = doc.data();
                this.nombre = data.nombre || '';
                this.apellido = data.apellido || '';
                this.tieneAuto = !!data.Vehiculo;
  
                // Guardar datos del usuario en el almacenamiento local
                await this.localdbService.guardar('user', {
                  uid: user.uid,
                  nombre: this.nombre,
                  apellido: this.apellido,
                  Vehiculo: data.Vehiculo || null,
                });
  
                this.cargarDatosDesdeFirestore(user.uid);
              }
            });
        } else {
          console.log('No se encontró usuario autenticado. Redirigiendo al login...');
          this.navCtrl.navigateRoot('/login');
        }
      });
    }
  }
  

  async cargarDatosDesdeFirestore(uid: string) {
    const userDoc = await this.firestore.collection('usuarios').doc(uid).get().toPromise();

    if (userDoc?.exists) {
      const userData: any = userDoc.data();

      this.nombre = userData.nombre || '';
      this.apellido = userData.apellido || '';
      this.tieneAuto = !!userData.Vehiculo;

      // Guardar los datos en almacenamiento local
      await this.localdbService.guardar('user', {
        uid,
        nombre: this.nombre,
        apellido: this.apellido,
        tieneAuto: this.tieneAuto,
      });

      console.log('Datos del usuario obtenidos desde Firestore y guardados localmente.');
      this.presentWelcomeToast();

      // Cargar viajes y reservas activos
      await this.cargarViajeActivo(uid);
      await this.cargarReservaActiva(uid);
    } else {
      throw new Error('No se encontraron datos en Firestore.');
    }
  }

  async cargarDatosDesdeAlmacenamientoLocal() {
    const storedUser = await this.localdbService.leer('user');
    const storedViaje = await this.localdbService.leer('viajeActivo');
    const storedReserva = await this.localdbService.leer('reservaActiva');

    if (storedUser) {
      this.nombre = storedUser.nombre || '';
      this.apellido = storedUser.apellido || '';
      this.tieneAuto = !!storedUser.tieneAuto;
    }

    if (storedViaje) {
      this.viajeActivo = storedViaje;
    }

    if (storedReserva) {
      this.reservaActiva = storedReserva;
    }

    this.cdr.detectChanges();
    console.log('Datos cargados desde almacenamiento local.');
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

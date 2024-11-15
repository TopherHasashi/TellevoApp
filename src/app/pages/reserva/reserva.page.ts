import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
import { Timestamp } from 'firebase/firestore';
import { Vehiculo, Viajes } from 'src/app/interfaces/iusuario';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.page.html',
  styleUrls: ['./reserva.page.scss'],
})
export class ReservaPage implements OnInit {
  nombre: string = '';
  apellido: string = '';
  fechaViajeString: string = '';

  vcl: Vehiculo = {
    Marca: "", Patente: "", Anio: 2000, Modelo: "",
    idVehiculo: ""
  };
  vje: Viajes = {
    idViaje: "",
    Destino: "",
    Asientos: 4,
    Costo: 1000,
    Fecha: Timestamp.fromDate(new Date())
  };

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private toastController: ToastController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Obtén el ID del viaje desde los parámetros de la ruta
    const viajeId = this.route.snapshot.paramMap.get('idViaje');
    
    if (viajeId) {
      // Obtén los datos del viaje
      this.firestore.collection('viajes').doc(viajeId).get().subscribe((doc) => {
        if (doc.exists) {
          const viajeData: any = doc.data();
          this.vje.Destino = viajeData.Destino;
          this.vje.Asientos = viajeData.Asientos;
          this.vje.Costo = viajeData.Costo;
          this.vje.Fecha = viajeData.Fecha;

          // Convierte el Timestamp a una fecha legible
          const fechaViaje = viajeData.Fecha?.toDate();
          this.fechaViajeString = fechaViaje ? fechaViaje.toLocaleString() : '';

          // Obtén los datos del usuario asociado al viaje
          this.firestore.collection('usuarios').doc(viajeData.idUsuario).get().subscribe((userDoc) => {
            if (userDoc.exists) {
              const userData: any = userDoc.data();
              this.nombre = userData.nombre || '';
              this.apellido = userData.apellido || '';

              // Asignar datos del vehículo
              if (userData.Vehiculo) {
                this.vcl.Marca = userData.Vehiculo.Marca || '';
                this.vcl.Patente = userData.Vehiculo.Patente || '';
                this.vcl.Anio = userData.Vehiculo.Anio || '';
                this.vcl.Modelo = userData.Vehiculo.Modelo || '';
                this.vcl.idVehiculo = userData.Vehiculo.idVehiculo || '';
              }
            }
          });
        }
      });
    } else {
      this.mostrarError('ID del viaje no encontrado');
    }
  }

  async mostrarError(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: 'danger'
    });
    await toast.present();
  }

  public toastButtons = [
    {
      text: 'Confirmo',
      role: 'accept',
    },
    {
      text: 'Cancelar',
      role: 'cancel',
    },
  ];
}

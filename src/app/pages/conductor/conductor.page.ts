import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Vehiculo ,Viajes } from '../../interfaces/iusuario';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.page.html',
  styleUrls: ['./conductor.page.scss'],
})
export class ConductorPage implements OnInit {
  nombre: string = '';
  apellido: string = '';

  vcl: Vehiculo = {
    Marca: "", Patente: "", Anio: 2000, Modelo: "",
    idVehiculo: ""
  };
  vje: Viajes = {
    idViaje:"",
    Destino:"",
    Asientos:4,
    Costo:1000,
    Fecha:Timestamp.fromDate(new Date())
  };

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
  ) {}  

  addViaje() {
  console.log('Fecha del viaje:', this.vje.Fecha);  // Verifica si la fecha está correcta

  const id = this.vje.idViaje || this.firestore.createId();
  this.vje.idViaje = id;

  if (this.vje.Fecha) {
    this.firestore.collection('viajes').add(this.vje)
      .then(() => {
        console.log('Viaje guardado con fecha en Firestore');
      })
      .catch((error) => {
        console.error('Error al guardar el viaje en Firestore: ', error);
      });
  } else {
    console.log('Por favor, seleccione una fecha.');
  }
}  

  ngOnInit() {
    this.afAuth.currentUser.then(user => {
      if (user) {
        this.firestore.collection('usuarios').doc(user.uid).get().subscribe((doc) => {
          if (doc.exists) {
            const data: any = doc.data(); // Temporalmente usa `any` para evitar errores de tipado
            console.log('Datos obtenidos:', data); // Verifica los datos en la consola
            this.nombre = data.nombre || '';
            this.apellido = data.apellido || '';
            this.vcl.Marca = data.Vehiculo.Marca || '';
            this.vcl.Patente = data.Vehiculo.Patente || '';
            this.vcl.Anio = data.Vehiculo.Anio || '';
            this.vcl.Modelo = data.Vehiculo.Modelo || '';
          }
        });
      }
    });
  }

}


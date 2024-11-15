import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Vehiculo ,Viajes } from '../../interfaces/iusuario';

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
    idVehiculo:"",
    idUsuario:"",
  };

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
  ) {}  
  crearViaje() {
    this.afAuth.currentUser.then(user => {
      if (user) {
        // Definimos los datos iniciales del viaje sin el campo id
        const viajeData = {
          idUsuario: user.uid,
          Destino: this.vje.Destino,
          Asientos: this.vje.Asientos,
          Costo: this.vje.Costo,
          
        };

        // Añadimos el documento y luego obtenemos el ID generado por Firestore
        this.firestore.collection('viajes').add(viajeData)
          .then((docRef) => {
            // Actualizamos el documento para agregar el ID del viaje
            return docRef.update({ idViaje: docRef.id });
          })
          .then(() => {
            console.log('Viaje creado y actualizado exitosamente');
          })
          .catch(error => {
            console.error('Error al crear el viaje:', error);
          });
      }
    });
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


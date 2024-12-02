import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Vehiculo, Viajes } from 'src/app/interfaces/iusuario';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.page.html',
  styleUrls: ['./conductor.page.scss'],
})
export class ConductorPage implements OnInit {
  nombre: string = '';
  apellido: string = '';
  vcl: Vehiculo = {
    Marca: '', Patente: '', Anio: 2000, Modelo: '',
    idVehiculo: ''
  };
  vje: Viajes = {
    idViaje: '',
    Destino: '',
    Asientos: 4,
    Costo: 1000,
    idVehiculo: '',
    idUsuario: ''
  };
  sugerencias: any[] = [];
  token: string = 'pk.eyJ1IjoidG9waGVyaGFzYXNoaSIsImEiOiJjbTNndTdsMTgwOGd2MmtwemE1M3pnYnZrIn0.DdITolvIbnmKgJUAJjjLrw'; 

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private http: HttpClient,
    private db: AngularFireDatabase,
    private router: Router
  ) {}

  ngOnInit() {
    this.afAuth.currentUser.then(user => {
      if (user) {
        this.firestore.collection('usuarios').doc(user.uid).get().subscribe((doc) => {
          if (doc.exists) {
            const data: any = doc.data();
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

  onSearchDestino(event: Event) {
    const input = (event.target as HTMLInputElement).value;

    if (input.length > 2) {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(input)}.json?access_token=${this.token}&autocomplete=true`;

      this.http.get(url).subscribe((response: any) => {
        this.sugerencias = response.features || [];
      });
    } else {
      this.sugerencias = [];
    }
  }

  seleccionarDestino(lugar: any) {
    this.vje.Destino = lugar.place_name;
    this.sugerencias = [];
    console.log('Destino seleccionado:', this.vje.Destino);
  }

  crearViaje() {
    this.afAuth.currentUser.then(user => {
      if (user) {
        const viajeData = {
          idUsuario: user.uid,
          Destino: this.vje.Destino,
          Asientos: this.vje.Asientos,
          Costo: this.vje.Costo,
          estado: "activo", // Indica que el viaje está activo
          idVehiculo: this.vje.idVehiculo,
          nombreConductor: this.nombre,
          apellidoConductor: this.apellido,
        };
  
        const viajeRef = this.db.list('viajes'); // Referencia a la lista "viajes"
        
        // Usamos push() correctamente
        const newRef = viajeRef.push(viajeData); // Esto crea el viaje y retorna la referencia
        if (newRef) {
          const id = newRef.key; // Obtenemos el ID del viaje
          console.log('Viaje guardado en Realtime Database con ID:', id);
          this.router.navigate(['/viaje-preview', id]); // Redirigir al preview
        } else {
          console.error('Error al crear el viaje: No se generó un ID');
        }
      }
    }).catch((error: any) => {
      console.error('Error al autenticar usuario:', error);
    });
  }
}

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
  viajeActivo: any = null; // Almacena el viaje activo del conductor

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

        this.db
        .list('viajes', (ref) => ref.orderByChild('idUsuario').equalTo(user.uid))
        .valueChanges()
        .subscribe((viajes: any[]) => {
          this.viajeActivo = viajes.find((viaje) => viaje.estado === 'activo');
          console.log('Viaje Activo:', this.viajeActivo);
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
        // Verificar si ya existe un viaje activo
        this.db
          .list('viajes', (ref) => ref.orderByChild('idUsuario').equalTo(user.uid))
          .valueChanges()
          .subscribe((viajes: any[]) => {
            const viajeActivo = viajes.find((viaje) => viaje.estado === 'activo');

            if (viajeActivo) {
              this.mostrarToast('Ya tienes un viaje activo. No puedes crear otro.', 'warning');
            } else {
              // Crear el viaje si no hay uno activo
              const viajeData = {
                idUsuario: user.uid,
                Destino: this.vje.Destino,
                Asientos: this.vje.Asientos,
                Costo: this.vje.Costo,
                estado: 'activo',
                idVehiculo: this.vje.idVehiculo,
                nombreConductor: this.nombre,
                apellidoConductor: this.apellido,
              };

              const viajeRef = this.db.list('viajes');
              viajeRef.push(viajeData).then((ref) => {
                const id = ref.key;
                console.log('Viaje guardado con ID:', id);

                // Actualizamos el nodo con el ID
                this.db.object(`viajes/${id}`).update({ id: id }).then(() => {
                  console.log('ID del viaje actualizado correctamente en Firebase.');
                  this.router.navigate(['/viaje-preview', id]);
                });
              });
            }
          });
      }
    }).catch((error: any) => {
      console.error('Error al autenticar usuario:', error);
    });
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = document.createElement('ion-toast');
    toast.message = mensaje;
    toast.duration = 2000;
    toast.color = color;
    document.body.appendChild(toast);
    await toast.present();
  }
}
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Vehiculo, Viajes } from 'src/app/interfaces/iusuario';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Subscription } from 'rxjs';
import { LocaldbService } from 'src/app/service/localdb.service';

@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.page.html',
  styleUrls: ['./conductor.page.scss'],
})
export class ConductorPage implements OnInit, OnDestroy {
  usuarioId: string = '';
  nombre: string = '';
  apellido: string = '';
  vcl: Vehiculo = {
    Marca: '',
    Patente: '',
    Anio: 2000,
    Modelo: '',
    idVehiculo: ''
  };
  vje: Viajes = {
    idViaje: '',
    Destino: '',
    Asientos: 4,
    Costo: 1000,
    idUsuario: ''
  };
  sugerencias: any[] = [];
  token: string = 'pk.eyJ1IjoidG9waGVyaGFzYXNoaSIsImEiOiJjbTNndTdsMTgwOGd2MmtwemE1M3pnYnZrIn0.DdITolvIbnmKgJUAJjjLrw';
  viajeActivo: any = null; // Almacena el viaje activo del conductor
  private viajeSubscription: Subscription | null = null; // Control de suscripción

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private http: HttpClient,
    private db: AngularFireDatabase,
    private router: Router,
    private localdbService: LocaldbService
  ) {}

  ngOnInit() {
    this.afAuth.currentUser.then(user => {
      if (user) {
        this.usuarioId = user.uid;
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

        // Cancelar suscripción previa si existe
        if (this.viajeSubscription) {
          this.viajeSubscription.unsubscribe();
        }

        // Verificar viajes activos
        this.viajeSubscription = this.db
          .list('viajes', (ref) => ref.orderByChild('idUsuario').equalTo(user.uid))
          .valueChanges()
          .subscribe((viajes: any[]) => {
            this.viajeActivo = viajes.find((viaje) => viaje.estado === 'activo');
            console.log('Viaje Activo:', this.viajeActivo);
          });
      }
    });
  }

  ngOnDestroy() {
    // Cancelar suscripción al destruir el componente
    if (this.viajeSubscription) {
      this.viajeSubscription.unsubscribe();
      console.log('Suscripción a viajes cancelada.');
    }
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
  async guardarViajeLocal(viajeData: any): Promise<void> {
    try {
      this.localdbService.guardar(`reserva_${viajeData.idViaje}`, viajeData);
      console.log('Viaje guardado localmente:', viajeData);
    } catch (error) {
      console.error('Error al guardar el viaje localmente:', error);
    }
  }
  crearViaje() {
    const viajeData = {
      idUsuario: this.usuarioId,
      Destino: this.vje.Destino,
      Asientos: this.vje.Asientos,
      Costo: this.vje.Costo,
      estado: 'activo',
      nombreConductor: this.nombre,
      apellidoConductor: this.apellido,
    };
    this.guardarViajeLocal(viajeData);
    this.afAuth.currentUser.then((user) => {
      if (user) {
        // Cancelar suscripción previa si existe
        if (this.viajeSubscription) {
          this.viajeSubscription.unsubscribe();
        }
  
        // Verificar si ya existe un viaje activo
        this.viajeSubscription = this.db
          .list('viajes', (ref) => ref.orderByChild('idUsuario').equalTo(user.uid))
          .valueChanges()
          .subscribe((viajes: any[]) => {
            const viajeActivo = viajes.find((viaje) => viaje.estado === 'activo' || viaje.estado === 'iniciado');
  
            if (viajeActivo) {
                this.mostrarToast('Ya tienes un viaje activo. No puedes crear otro.', 'warning');
                return;
            } else {
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
  
              // Cancelar la suscripción después de la creación del viaje
              if (this.viajeSubscription) {
                this.viajeSubscription.unsubscribe();
                this.viajeSubscription = null;
              }
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

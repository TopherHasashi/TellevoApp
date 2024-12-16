import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import * as mapboxgl from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';
import { LocaldbService } from 'src/app/service/localdb.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-viajeencurso',
  templateUrl: './viajeencurso.page.html',
  styleUrls: ['./viajeencurso.page.scss'],
})
export class ViajeencursoPage implements OnInit {
  viaje: any = {};
  idViaje: string = '';
  destino: string = ''; // Para almacenar el destino asociado
  map!: mapboxgl.Map;

  constructor(
    private route: ActivatedRoute,
    private db: AngularFireDatabase,
    private localdbService: LocaldbService,
    private router: Router,
    private toastController: ToastController,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    this.idViaje = this.route.snapshot.paramMap.get('id') || '';

    if (this.idViaje) {
      // Cargar datos desde el almacenamiento local primero
      this.viaje = await this.localdbService.leer(`viaje_${this.idViaje}`);
      if (this.viaje?.Destino) {
        console.log('Datos cargados desde almacenamiento local:', this.viaje);
        this.initializeMap(this.viaje.Destino);
      } else {
        console.log('No hay datos locales. Intentando cargar desde Firebase...');
        // Actualizar desde Firebase
      this.db.object(`viajes/${this.idViaje}`).valueChanges().subscribe(async (data: any) => {
        if (data) {
          this.viaje = data;
          console.log('Datos cargados desde Firebase:', this.viaje);
          await this.localdbService.guardar(`viaje_${this.idViaje}`, data); // Guardar localmente
          this.initializeMap(this.viaje.Destino);
        } else {
          this.mostrarToast('No se encontraron datos del viaje.', 'warning');
          this.router.navigate(['/home']);
        }
      });
      }      
    } else {
      this.router.navigate(['/home']);
      this.mostrarToast('ID de viaje no válido.', 'danger');
    }
  }
  
  initializeMap(address: string) {
    const mapboxToken = 'pk.eyJ1IjoidG9waGVyaGFzYXNoaSIsImEiOiJjbTNndTdsMTgwOGd2MmtwemE1M3pnYnZrIn0.DdITolvIbnmKgJUAJjjLrw';
    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving`;
    const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxToken}`;
  
    // Obtener coordenadas del destino
    this.http.get(geocodingUrl).subscribe((response: any) => {
      if (response.features && response.features.length > 0) {
        const [lngDest, latDest] = response.features[0].center;
  
        // Obtener ubicación actual con alta precisión
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lngStart = position.coords.longitude;
            const latStart = position.coords.latitude;
  
            console.log('Ubicación exacta obtenida:', lngStart, latStart);
            console.log('Destino obtenido:', lngDest, latDest);
  
            // Inicializar el mapa
            (mapboxgl as any).accessToken = mapboxToken;
            this.map = new mapboxgl.Map({
              container: 'map',
              style: 'mapbox://styles/mapbox/streets-v11',
              center: [lngStart, latStart], // Centrar en ubicación exacta
              zoom: 14,
            });
  
            this.map.on('load', () => {
              this.drawRoute(lngStart, latStart, lngDest, latDest, mapboxToken, directionsUrl);
            });
          },
          (error) => {
            console.error('Error al obtener la ubicación exacta:', error);
          },

        );
      } else {
        console.error('No se encontraron coordenadas para el destino.');
      }
    }, (error) => {
      console.error('Error al obtener las coordenadas del destino:', error);
    });
  }
  
  
  drawRoute(lngStart: number, latStart: number, lngDest: number, latDest: number, mapboxToken: string, directionsUrl: string) {
    const routeUrl = `${directionsUrl}/${lngStart},${latStart};${lngDest},${latDest}?geometries=geojson&access_token=${mapboxToken}`;
  
    this.http.get(routeUrl).subscribe((response: any) => {
      const route = response.routes[0]?.geometry;
  
      if (route) {
        // Añadir la fuente y la capa de la ruta al mapa
        this.map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: route,
          },
        });
  
        this.map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': '#1db7dd', 'line-width': 5 },
        });
  
        console.log('Ruta trazada correctamente.');
      } else {
        this.mostrarToast('No se pudo trazar la ruta.', 'warning');
      }
    }, (error) => {
      console.error('Error al obtener la ruta:', error);
      this.mostrarToast('Error al obtener la ruta.', 'danger');
    });
  }
  
  
  finalizarViaje() {
    if (this.idViaje) {
      // Cambiar el estado del viaje a "finalizado"
      this.db.object(`viajes/${this.idViaje}`).update({ estado: 'finalizado' }).then(() => {
        console.log('Viaje finalizado correctamente.');
        
        // Cambiar el estado de las reservas asociadas al viaje a "finalizado"
        this.db.list('reservas', ref => ref.orderByChild('idViaje').equalTo(this.idViaje))
          .snapshotChanges()
          .subscribe(reservas => {
            reservas.forEach(reservaSnapshot => {
              const key = reservaSnapshot.key; // ID de la reserva
              if (key) {
                this.db.object(`reservas/${key}`).update({ estado: 'finalizado' }).then(() => {
                  console.log(`Reserva ${key} finalizada correctamente.`);
                }).catch(error => {
                  console.error(`Error al finalizar la reserva ${key}:`, error);
                });
              }
            });
          });
        this.localdbService.remover(`viaje_${this.idViaje}`);
        // Redirigir al conductor al home
        this.router.navigate(['/home']);
        this.mostrarToast('Viaje finalizado correctamente.', 'success');
      }).catch(error => {
        console.error('Error al finalizar el viaje:', error);
        this.mostrarToast('Error al finalizar el viaje.', 'danger');

      });
    }
  }  
  // Método para mostrar notificaciones
  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
    });
    await toast.present();
  }
}

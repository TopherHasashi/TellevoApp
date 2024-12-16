import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ToastController } from '@ionic/angular';
import * as mapboxgl from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';
import { LocaldbService } from 'src/app/service/localdb.service';

@Component({
  selector: 'app-espera',
  templateUrl: './espera.page.html',
  styleUrls: ['./espera.page.scss'],
})
export class EsperaPage implements OnInit {
  reserva: any = {};
  idReserva: string = '';
  destino: string = ''; // Para almacenar el destino asociado
  map!: mapboxgl.Map;

  constructor(
    private route: ActivatedRoute,
    private db: AngularFireDatabase,
    private toastController: ToastController,
    private router: Router,
    private http: HttpClient,
    private localdbService: LocaldbService
  ) {}

  async ngOnInit() {
    this.idReserva = this.route.snapshot.paramMap.get('id') || '';

    if (this.idReserva) {
      try {
        // Intentar cargar la reserva desde Firebase
        this.db.object(`reservas/${this.idReserva}`).valueChanges().subscribe(async (data: any) => {
          if (data) {
            this.reserva = data;
            await this.localdbService.guardar(`reserva_${this.idReserva}`, data);

            if (this.reserva?.estado === 'finalizado') {
              this.router.navigate(['/home']);
            }

            if (this.reserva.idViaje) {
              this.cargarDatosViaje(this.reserva.idViaje);
            }
          } else {
            // Cargar desde almacenamiento local si falla
            this.reserva = await this.localdbService.leer(`reserva_${this.idReserva}`);
            if (this.reserva?.estado === 'finalizado') {
              this.router.navigate(['/home']);
            }

            if (this.reserva?.idViaje) {
              this.cargarDatosViaje(this.reserva.idViaje);
            } else {
              this.mostrarToast('No se encontró información de la reserva.', 'warning');
            }
          }
        });
      } catch (error) {
        console.error('Error al cargar datos de la reserva:', error);
        // Cargar desde almacenamiento local si Firebase falla
        this.reserva = await this.localdbService.leer(`reserva_${this.idReserva}`);
        if (this.reserva?.idViaje) {
          this.cargarDatosViaje(this.reserva.idViaje);
        } else {
          this.router.navigate(['/home']);
          this.mostrarToast('No se encontró la reserva.', 'danger');
        }
      }
    } else {
      this.router.navigate(['/home']);
      this.mostrarToast('ID de reserva no válido.', 'danger');
    }
  }

  async cargarDatosViaje(idViaje: string) {
    try {
      this.db.object(`viajes/${idViaje}`).valueChanges().subscribe(async (viaje: any) => {
        if (viaje) {
          this.destino = viaje?.Destino || 'No disponible';
          await this.localdbService.guardar(`viaje_${idViaje}`, viaje);
          if (viaje?.Destino) {
            this.initializeMap(viaje.Destino);
          }
        } else {
          const viajeLocal = await this.localdbService.leer(`viaje_${idViaje}`);
          if (viajeLocal) {
            this.destino = viajeLocal?.Destino || 'No disponible';
            this.initializeMap(viajeLocal.Destino);
          } else {
            this.mostrarToast('No se encontraron datos del viaje.', 'warning');
          }
        }
      });
    } catch (error) {
      console.error('Error al cargar datos del viaje:', error);
    }
  }

  initializeMap(address: string) {
    const mapboxToken = 'pk.eyJ1IjoidG9waGVyaGFzYXNoaSIsImEiOiJjbTNndTdsMTgwOGd2MmtwemE1M3pnYnZrIn0.DdITolvIbnmKgJUAJjjLrw';
    const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxToken}`;

    this.http.get(geocodingUrl).subscribe((response: any) => {
      if (response.features?.length > 0) {
        const [lngDest, latDest] = response.features[0].center;

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lngStart = position.coords.longitude;
            const latStart = position.coords.latitude;

            (mapboxgl as any).accessToken = mapboxToken;
            this.map = new mapboxgl.Map({
              container: 'map',
              style: 'mapbox://styles/mapbox/streets-v11',
              center: [lngStart, latStart],
              zoom: 14,
            });

            this.map.on('load', () => {
              this.drawRoute(lngStart, latStart, lngDest, latDest);
            });
          },
          (error) => console.error('Error al obtener la ubicación actual:', error)
        );
      }
    });
  }

  drawRoute(lngStart: number, latStart: number, lngDest: number, latDest: number) {
    const mapboxToken = 'pk.eyJ1IjoidG9waGVyaGFzYXNoaSIsImEiOiJjbTNndTdsMTgwOGd2MmtwemE1M3pnYnZrIn0.DdITolvIbnmKgJUAJjjLrw';
    const routeUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${lngStart},${latStart};${lngDest},${latDest}?geometries=geojson&access_token=${mapboxToken}`;

    this.http.get(routeUrl).subscribe((response: any) => {
      const route = response.routes[0]?.geometry;

      if (route) {
        this.map.addSource('route', {
          type: 'geojson',
          data: { type: 'Feature', properties: {}, geometry: route },
        });

        this.map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': '#1db7dd', 'line-width': 5 },
        });
      }
    });
  }

  async cancelarReserva() {
    if (this.idReserva) {
      this.db.object(`reservas/${this.idReserva}`).update({ estado: 'cancelado' }).then(async () => {
        await this.localdbService.remover(`reserva_${this.idReserva}`);
        this.router.navigate(['/home']);
        this.mostrarToast('Reserva cancelada correctamente.', 'success');
      }).catch((error) => {
        console.error('Error al cancelar la reserva:', error);
        this.mostrarToast('Error al cancelar la reserva.', 'danger');
      });
    }
  }

  async mostrarToast(message: string, color: string) {
    const toast = await this.toastController.create({ message, duration: 2000, color });
    await toast.present();
  }
}

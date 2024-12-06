import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ToastController } from '@ionic/angular';
import * as mapboxgl from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';

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
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.idReserva = this.route.snapshot.paramMap.get('id') || '';
    if (this.idReserva) {
      // Obtener los datos de la reserva
      this.db.object(`reservas/${this.idReserva}`).valueChanges().subscribe((data: any) => {
        this.reserva = data;

        // Obtener el destino desde el viaje asociado
        if (this.reserva.idViaje) {
          this.db.object(`viajes/${this.reserva.idViaje}`).valueChanges().subscribe((viaje: any) => {
            this.destino = viaje?.Destino || 'No disponible';

            // Inicializar el mapa después de obtener el destino
            if (viaje?.Destino) {
              this.initializeMap(viaje.Destino, viaje.conductorLocation);
            }
          });
        }
      });
    }
  }

  initializeMap(address: string, conductorLocation: { lat: number; lng: number }) {
    const mapboxToken = 'pk.eyJ1IjoidG9waGVyaGFzYXNoaSIsImEiOiJjbTNndTdsMTgwOGd2MmtwemE1M3pnYnZrIn0.DdITolvIbnmKgJUAJjjLrw';
    const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxToken}`;

    this.http.get(geocodingUrl).subscribe((response: any) => {
      if (response.features && response.features.length > 0) {
        const [lngDest, latDest] = response.features[0].center;

        // Inicializar el mapa centrado en el destino
        (mapboxgl as any).accessToken = mapboxToken;
        this.map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [lngDest, latDest],
          zoom: 14,
        });

        this.map.on('load', () => {
          this.drawRoute(lngDest, latDest, conductorLocation);
        });
      } else {
        console.error('No se encontraron coordenadas para esta dirección.');
      }
    }, error => {
      console.error('Error al obtener las coordenadas del destino:', error);
    });
  }

  drawRoute(lngDest: number, latDest: number, conductorLocation: { lat: number; lng: number }) {
    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${conductorLocation.lng},${conductorLocation.lat};${lngDest},${latDest}?geometries=geojson&access_token=pk.eyJ1IjoidG9waGVyaGFzYXNoaSIsImEiOiJjbTNndTdsMTgwOGd2MmtwemE1M3pnYnZrIn0.DdITolvIbnmKgJUAJjjLrw`;

    this.http.get(directionsUrl).subscribe((response: any) => {
      const route = response.routes[0].geometry;

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
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#ff0000',
          'line-width': 5,
        },
      });
    }, error => {
      console.error('Error al obtener la ruta:', error);
    });
  }

  async cancelarReserva() {
    if (this.idReserva) {
      const reserva = this.reserva;

      // Cambiar el estado de la reserva a "cancelado"
      this.db.object(`reservas/${this.idReserva}`).update({ estado: 'cancelado' }).then(async () => {
        console.log('Reserva cancelada correctamente.');

        if (reserva.idViaje) {
          this.db.object(`viajes/${reserva.idViaje}`).query.once('value').then((snapshot: any) => {
            const viaje = snapshot.val();
            if (viaje && viaje.estado === 'activo') {
              const nuevosAsientos = (viaje.Asientos || 0) + 1;
              this.db.object(`viajes/${reserva.idViaje}`).update({ Asientos: nuevosAsientos });
            }
          });
        }

        const toast = await this.toastController.create({
          message: 'Reserva cancelada correctamente.',
          duration: 2000,
          color: 'success',
        });
        await toast.present();
        this.router.navigate(['/home']);
      }).catch(async (error) => {
        console.error('Error al cancelar la reserva:', error);
        const toast = await this.toastController.create({
          message: 'Error al cancelar la reserva.',
          duration: 2000,
          color: 'danger',
        });
        await toast.present();
      });
    }
  }
}

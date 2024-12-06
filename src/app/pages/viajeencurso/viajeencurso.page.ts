import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import * as mapboxgl from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-viajeencurso',
  templateUrl: './viajeencurso.page.html',
  styleUrls: ['./viajeencurso.page.scss'],
})
export class ViajeencursoPage implements OnInit, AfterViewInit {
  viaje: any = {};
  idViaje: string = '';
  map!: mapboxgl.Map;

  constructor(
    private route: ActivatedRoute,
    private db: AngularFireDatabase,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.idViaje = this.route.snapshot.paramMap.get('id') || '';
    if (this.idViaje) {
      this.db.object(`viajes/${this.idViaje}`).valueChanges().subscribe((data: any) => {
        this.viaje = data;
        if (this.viaje?.Destino) {
          this.initializeMap(this.viaje.Destino);
        }
      });
    }
  }

  ngAfterViewInit() {
    // El mapa se inicializará después de obtener las coordenadas del destino
  }

  initializeMap(address: string) {
    const mapboxToken = 'pk.eyJ1IjoidG9waGVyaGFzYXNoaSIsImEiOiJjbTNndTdsMTgwOGd2MmtwemE1M3pnYnZrIn0.DdITolvIbnmKgJUAJjjLrw';
    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving`;
    const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxToken}`;

    this.http.get(geocodingUrl).subscribe((response: any) => {
      if (response.features && response.features.length > 0) {
        const [lngDest, latDest] = response.features[0].center; // Coordenadas del destino

        // Obtener ubicación actual del conductor
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lngStart = position.coords.longitude;
            const latStart = position.coords.latitude;

            // Inicializar el mapa
            (mapboxgl as any).accessToken = mapboxToken;
            this.map = new mapboxgl.Map({
              container: 'map',
              style: 'mapbox://styles/mapbox/streets-v11',
              center: [lngStart, latStart], // Centrar en la ubicación actual
              zoom: 14,
            });

            this.map.on('load', () => {
              // Obtener y trazar la ruta
              this.drawRoute(lngStart, latStart, lngDest, latDest, mapboxToken, directionsUrl);
            });
          },
          (error) => {
            console.error('Error al obtener la ubicación actual:', error);
          }
        );
      } else {
        console.error('No se encontraron coordenadas para esta dirección.');
      }
    }, error => {
      console.error('Error al obtener las coordenadas del destino:', error);
    });
  }

  // Método para dibujar la ruta en el mapa
  drawRoute(lngStart: number, latStart: number, lngDest: number, latDest: number, mapboxToken: string, directionsUrl: string) {
    const routeUrl = `${directionsUrl}/${lngStart},${latStart};${lngDest},${latDest}?geometries=geojson&access_token=${mapboxToken}`;

    this.http.get(routeUrl).subscribe((response: any) => {
      const route = response.routes[0].geometry;

      // Verificar si la fuente de la ruta ya existe y actualizarla, si no, agregarla
      if (this.map.getSource('route')) {
        (this.map.getSource('route') as mapboxgl.GeoJSONSource).setData({
          type: 'Feature',
          properties: {},
          geometry: route, // GeoJSON con la ruta
        });
      } else {
        this.map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: route, // GeoJSON con la ruta
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
            'line-color': '#1db7dd',
            'line-width': 5,
          },
        });
      }
    }, error => {
      console.error('Error al obtener la ruta:', error);
    });
  }

  finalizarViaje() {
    if (this.idViaje) {
      this.db.object(`viajes/${this.idViaje}`).update({ estado: 'finalizado' }).then(() => {
        console.log('Viaje finalizado correctamente');
        this.router.navigate(['/home']);
      }).catch((error) => {
        console.error('Error al finalizar el viaje:', error);
      });
    }
  }
}

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
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxToken}`;

    this.http.get(url).subscribe((response: any) => {
      if (response.features && response.features.length > 0) {
        const [lng, lat] = response.features[0].center; // Coordenadas del destino

        // Inicializar el mapa con las coordenadas del destino
        (mapboxgl as any).accessToken = mapboxToken;
        this.map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [lng, lat], // Coordenadas iniciales basadas en el destino
          zoom: 14, // Zoom inicial
        });

        this.map.on('load', () => {
          this.addDestinationMarker(lng, lat);
        });
      } else {
        console.error('No se encontraron coordenadas para esta dirección.');
      }
    }, error => {
      console.error('Error al obtener las coordenadas del destino:', error);
    });
  }

  addDestinationMarker(lng: number, lat: number) {
    new mapboxgl.Marker({ color: 'red' })
      .setLngLat([lng, lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // Popup que muestra información del destino
          .setHTML(`<strong>Destino:</strong> ${this.viaje.Destino}`)
      )
      .addTo(this.map);
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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-viaje-preview',
  templateUrl: './viaje-preview.page.html',
  styleUrls: ['./viaje-preview.page.scss'],
})
export class ViajePreviewPage implements OnInit {
  viaje: any = {}; // Para almacenar los detalles del viaje

  constructor(
    private route: ActivatedRoute, // Manejo de la ruta
    private firestore: AngularFirestore // Acceso a Firebase
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id'); // Obtener el ID de la URL
    if (id) {
      this.firestore.collection('viajes').doc(id).valueChanges().subscribe((data: any) => {
        this.viaje = data; // Cargar datos del viaje
        console.log('Detalles del viaje:', this.viaje); // Confirmación en consola
      });
    }
  }

  iniciarRecorrido() {
    console.log('Recorrido iniciado'); // Confirmación en consola
  }
  
  cancelarViaje() {
    console.log('Viaje cancelado'); // Confirmación en consola
  }
}


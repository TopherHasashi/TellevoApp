import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-viaje-preview',
  templateUrl: './viaje-preview.page.html',
  styleUrls: ['./viaje-preview.page.scss'],
})
export class ViajePreviewPage implements OnInit {
  viaje: any = {}; // Para almacenar los detalles del viaje

  constructor(
    private route: ActivatedRoute, // Manejo de la ruta
    private firestore: AngularFirestore, // Acceso a Firebase
    private db: AngularFireDatabase
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id'); // Obtener el ID de la URL
    if (id) {
      this.db.object(`viajes/${id}`).valueChanges().subscribe((data: any) => {
        if (data) {
          this.viaje = data; // Cargar datos del viaje
          console.log('Detalles del viaje:', this.viaje); // Confirmación en consola
        } else {
          console.error('No se encontraron datos para el ID:', id);
        }
      });
    } else {
      console.error('ID no proporcionado en la ruta');
    }
  }
  

  iniciarRecorrido() {
    console.log('Recorrido iniciado'); // Confirmación en consola
  }
  
  cancelarViaje() {
    console.log('Viaje cancelado'); // Confirmación en consola
  }
}


import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from 'src/app/interfaces/iusuario';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  reservas: any[] = []; // Lista de reservas
  usuario: Usuario | null = null; // Usuario autenticado

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private db: AngularFireDatabase,
  ) {}

  ngOnInit() {
    // Obtén el usuario autenticado
    this.afAuth.currentUser.then((user) => {
      if (user) {
        // Recupera información del usuario autenticado desde Firestore
        this.firestore
          .collection<Usuario>('usuarios')
          .doc(user.uid)
          .valueChanges()
          .subscribe((data) => {
            if (data) {
              this.usuario = {
                id: user.uid,
                email: data.email || '',
                password: '', // No almacenamos la contraseña aquí por seguridad
                nombre: data.nombre || '',
                apellido: data.apellido || '',
              };
              this.loadReservas();
            }
          });
      }
    });
  }

  loadReservas() {
    if (this.usuario) {
      this.db.list('reservas', (ref) => ref.orderByChild('idConductor').equalTo(this.usuario!.id))
        .valueChanges()
        .subscribe((data: any[]) => {
          this.reservas = data;
          console.log('Reservas relacionadas con los viajes del conductor:', this.reservas);
        });
    }
  }
}

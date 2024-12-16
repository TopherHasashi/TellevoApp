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
  reservas: any[] = []; // Lista de reservas finalizadas
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
      // Filtrar las reservas del usuario con estado "finalizado" o "cancelado"
      this.db.list('reservas', (ref) => ref.orderByChild('idUsuario').equalTo(this.usuario!.id))
        .valueChanges()
        .subscribe((data: any[]) => {
          const reservasProcesadas = data.filter((reserva) =>
            reserva.estado === 'finalizado' || reserva.estado === 'cancelado'
          );
          // Obtener datos adicionales para cada reserva
          this.procesarReservas(reservasProcesadas);
        });
    }
  }

  procesarReservas(reservas: any[]) {
    const reservasConDatos: any[] = [];
    const promesas = reservas.map((reserva) => {
      return new Promise<void>((resolve) => {
        this.db.object(`viajes/${reserva.idViaje}`).valueChanges().subscribe((viaje: any) => {
          if (viaje) {
            reserva.destino = viaje.Destino || 'Destino no disponible';
            reserva.nombreConductor = viaje.nombreConductor || 'Conductor no disponible';
          } else {
            reserva.destino = 'Destino no disponible';
            reserva.nombreConductor = 'Conductor no disponible';
          }
          reservasConDatos.push(reserva);
          resolve();
        });
      });
    });

    // Esperar a que todas las promesas se resuelvan
    Promise.all(promesas).then(() => {
      this.reservas = reservasConDatos;
      console.log('Reservas procesadas:', this.reservas);
    });
  }
}

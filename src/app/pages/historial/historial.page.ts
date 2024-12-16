import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LocaldbService } from 'src/app/service/localdb.service';
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
    private localdbService: LocaldbService // Servicio para manejar el almacenamiento local
  ) {}

  async ngOnInit() {
    try {
      // Intentar cargar usuario desde almacenamiento local
      const storedUser = await this.localdbService.leer('user');
      if (storedUser) {
        this.usuario = storedUser;
        console.log('Usuario cargado desde almacenamiento local:', this.usuario);
        await this.cargarReservas();
      } else {
        // Si no hay usuario local, intentar obtenerlo desde Firebase
        this.afAuth.currentUser.then((user) => {
          if (user) {
            this.firestore
              .collection<Usuario>('usuarios')
              .doc(user.uid)
              .valueChanges()
              .subscribe(async (data) => {
                if (data) {
                  this.usuario = {
                    id: user.uid,
                    email: data.email || '',
                    password: '', // No almacenamos la contraseña aquí por seguridad
                    nombre: data.nombre || '',
                    apellido: data.apellido || '',
                  };

                  // Guardar usuario en almacenamiento local
                  await this.localdbService.guardar('user', this.usuario);

                  await this.cargarReservas();
                }
              });
          }
        });
      }
    } catch (error) {
      console.error('Error al cargar el usuario:', error);
    }
  }

  async cargarReservas() {
    try {
      if (this.usuario) {
        // Intentar cargar reservas desde Firebase
        this.db
          .list('reservas', (ref) =>
            ref.orderByChild('idUsuario').equalTo(this.usuario!.id)
          )
          .valueChanges()
          .subscribe(
            async (data: any[]) => {
              const reservasProcesadas = data.filter(
                (reserva) =>
                  reserva.estado === 'finalizado' || reserva.estado === 'cancelado'
              );

              // Guardar reservas en almacenamiento local
              await this.localdbService.guardar(
                'reservas_historial',
                reservasProcesadas
              );

              // Procesar reservas para agregar datos adicionales
              this.procesarReservas(reservasProcesadas);
            },
            async (error) => {
              console.error(
                'Error al cargar reservas desde Firebase. Intentando cargar desde almacenamiento local:',
                error
              );

              // Si falla la carga desde Firebase, cargar desde almacenamiento local
              const reservasLocales =
                (await this.localdbService.leer('reservas_historial')) || [];
              this.procesarReservas(reservasLocales);
            }
          );
      }
    } catch (error) {
      console.error('Error al cargar reservas:', error);

      // Cargar reservas desde almacenamiento local en caso de error
      const reservasLocales =
        (await this.localdbService.leer('reservas_historial')) || [];
      this.procesarReservas(reservasLocales);
    }
  }

  procesarReservas(reservas: any[]) {
    const reservasConDatos: any[] = [];
    const promesas = reservas.map((reserva) => {
      return new Promise<void>((resolve) => {
        this.db
          .object(`viajes/${reserva.idViaje}`)
          .valueChanges()
          .subscribe(
            async (viaje: any) => {
              if (viaje) {
                reserva.destino = viaje.Destino || 'Destino no disponible';
                reserva.nombreConductor =
                  viaje.nombreConductor || 'Conductor no disponible';
              } else {
                reserva.destino = 'Destino no disponible';
                reserva.nombreConductor = 'Conductor no disponible';
              }

              reservasConDatos.push(reserva);

              // Guardar reserva con datos completos en almacenamiento local
              await this.localdbService.guardar(
                `reserva_${reserva.idReserva}`,
                reserva
              );

              resolve();
            },
            async (error) => {
              console.error(
                `Error al cargar datos del viaje ${reserva.idViaje}:`,
                error
              );

              // Cargar datos desde almacenamiento local en caso de error
              const reservaLocal =
                (await this.localdbService.leer(
                  `reserva_${reserva.idReserva}`
                )) || reserva;

              reservasConDatos.push(reservaLocal);
              resolve();
            }
          );
      });
    });

    // Esperar a que todas las promesas se resuelvan
    Promise.all(promesas).then(() => {
      this.reservas = reservasConDatos;
      console.log('Reservas procesadas:', this.reservas);
    });
  }
}

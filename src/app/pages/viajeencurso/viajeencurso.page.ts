import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-viajeencurso',
  templateUrl: './viajeencurso.page.html',
  styleUrls: ['./viajeencurso.page.scss'],
})
export class ViajeencursoPage implements OnInit {

  viaje: any = {};
  idViaje: string = '';

  constructor(
    private route: ActivatedRoute,
    private db: AngularFireDatabase,
    private router: Router
  ) { }

  ngOnInit() {
    this.idViaje = this.route.snapshot.paramMap.get('id') || '';
    if (this.idViaje) {
      this.db.object(`viajes/${this.idViaje}`).valueChanges().subscribe((data: any) => {
        this.viaje = data;
      });
    }
  }

  finalizarViaje() {
    if (this.idViaje) {
      // Cambiar el estado del viaje a "finalizado"
      this.db.object(`viajes/${this.idViaje}`).update({ estado: 'finalizado' }).then(() => {
        console.log('Viaje finalizado correctamente');
  
        // Actualizar el estado de las reservas asociadas a este viaje
        this.db.list('reservas', (ref) => ref.orderByChild('idViaje').equalTo(this.idViaje))
          .snapshotChanges()
          .subscribe((snapshots) => {
            snapshots.forEach((snapshot) => {
              const reservaKey = snapshot.key; // ID de la reserva
              if (reservaKey) {
                this.db.object(`reservas/${reservaKey}`).update({ estado: 'finalizado' }).then(() => {
                  console.log(`Reserva ${reservaKey} asociada al viaje ${this.idViaje} finalizada.`);
                }).catch((error) => {
                  console.error(`Error al finalizar la reserva ${reservaKey}:`, error);
                });
              }
            });
  
            // Redirigir al home después de actualizar reservas
            this.router.navigate(['/home']);
          });
      }).catch((error) => {
        console.error('Error al finalizar el viaje:', error);
      });
    }
  }
}  

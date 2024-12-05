import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-espera',
  templateUrl: './espera.page.html',
  styleUrls: ['./espera.page.scss'],
})
export class EsperaPage implements OnInit {
  reserva: any = {};
  idReserva: string = '';
  destino: string = ''; // Para almacenar el destino asociado

  constructor(
    private route: ActivatedRoute,
    private db: AngularFireDatabase,
    private toastController: ToastController,
    private router: Router
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
          });
        }
      });
    }
  }

  async cancelarReserva() {
    if (this.idReserva) {
      const reserva = this.reserva; // Guardar una referencia a la reserva actual
  
      // Cambiar el estado de la reserva a "cancelado"
      this.db.object(`reservas/${this.idReserva}`).update({ estado: 'cancelado' }).then(async () => {
        console.log('Reserva cancelada correctamente.');
  
        // Si el viaje no ha iniciado, incrementar los asientos disponibles
        if (reserva.idViaje) {
          // Realizamos una única lectura del viaje asociado
          this.db.object(`viajes/${reserva.idViaje}`).query.once('value').then((snapshot: any) => {
            const viaje = snapshot.val(); // Obtener datos del viaje
            if (viaje && viaje.estado === 'activo') {
              const nuevosAsientos = (viaje.Asientos || 0) + 1;
              this.db.object(`viajes/${reserva.idViaje}`).update({ Asientos: nuevosAsientos }).then(() => {
                console.log('Asiento devuelto al viaje:', reserva.idViaje);
              }).catch((error) => {
                console.error('Error al devolver asiento al viaje:', error);
              });
            }
          });
        }
  
        // Mostrar mensaje de confirmación y redirigir al home
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
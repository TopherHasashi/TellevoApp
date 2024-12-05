import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute , Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-viaje-preview',
  templateUrl: './viaje-preview.page.html',
  styleUrls: ['./viaje-preview.page.scss'],
})
export class ViajePreviewPage implements OnInit, OnDestroy {
  viaje: any = {}; 
  private viajeSubscription: Subscription | null = null; 

  constructor(
    private route: ActivatedRoute, // Manejo de rutas
    private db: AngularFireDatabase, // Firebase Realtime Database
    private router: Router, // Redirección
    private alertController: AlertController // Alertas para confirmar acciones
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id'); // Obtener el ID del viaje desde la URL
    if (id) {
      // Suscribirse a los datos del viaje
      this.viajeSubscription = this.db.object(`viajes/${id}`).valueChanges().subscribe((data: any) => {
        if (data) {
          this.viaje = data; // Guardar los datos del viaje
          console.log('Detalles del viaje:', this.viaje);
        } else {
          console.error('No se encontraron datos para el ID:', id);
        }
      });
    } else {
      console.error('ID no proporcionado en la ruta');
    }
  }

  ngOnDestroy() {
    // Cancelar la suscripción cuando el componente se destruya
    if (this.viajeSubscription) {
      this.viajeSubscription.unsubscribe();
      console.log('Suscripción a viaje cancelada.');
    }
  }

  iniciarRecorrido() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.db.object(`viajes/${id}`).update({ estado: 'iniciado' }).then(() => {
        console.log('Viaje iniciado con éxito');
        this.router.navigate(['/viajeencurso', id]); // Redirige a la nueva página
      }).catch((error) => {
        console.error('Error al iniciar el viaje:', error);
      });
    }
  }

  async presentConfirmAlert() {
    const alert = await this.alertController.create({
      header: 'Confirmar Cancelación',
      message: '¿Estás seguro de que deseas cancelar este viaje?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancelación abortada.');
          },
        },
        {
          text: 'Sí, cancelar',
          handler: () => {
            this.cancelarViaje(); // Llamar al método para cancelar el viaje
          },
        },
      ],
    });

    await alert.present();
  }

  cancelarViaje() {
    const id = this.viaje.id; // Obtener el ID del viaje
    if (id) {
      // Cambiar el estado de las reservas asociadas a "cancelado"
      this.db.list('reservas', (ref) => ref.orderByChild('idViaje').equalTo(id))
        .snapshotChanges()
        .subscribe((snapshots) => {
          snapshots.forEach((snapshot) => {
            const reservaKey = snapshot.key; // ID de la reserva
            if (reservaKey) {
              this.db.object(`reservas/${reservaKey}`).update({ estado: 'cancelado' }).then(() => {
                console.log(`Reserva ${reservaKey} asociada al viaje ${id} cancelada.`);
              }).catch((error) => {
                console.error(`Error al cancelar la reserva ${reservaKey}:`, error);
              });
            }
          });
  
          // Eliminar el viaje de la base de datos
          this.db.object(`viajes/${id}`).remove().then(() => {
            console.log('Viaje eliminado correctamente.');
            this.router.navigate(['/conductor']); // Redirigir al conductor a su página principal
          }).catch((error) => {
            console.error('Error al eliminar el viaje:', error);
          });
        });
    } else {
      console.error('ID del viaje no encontrado. No se puede eliminar.');
    }
  }
}  

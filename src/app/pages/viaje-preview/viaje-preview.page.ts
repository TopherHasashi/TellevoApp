import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ToastController, AlertController } from '@ionic/angular';
import { LocaldbService } from 'src/app/service/localdb.service';

@Component({
  selector: 'app-viaje-preview',
  templateUrl: './viaje-preview.page.html',
  styleUrls: ['./viaje-preview.page.scss'],
})
export class ViajePreviewPage implements OnInit {
  viaje: any = {}; // Datos del viaje
  idViaje: string = '';
  reservas: any[] = []; // Lista de reservas asociadas al viaje

  constructor(
    private route: ActivatedRoute,
    private db: AngularFireDatabase,
    private toastController: ToastController,
    private router: Router,
    private alertController: AlertController,
    private localdbService: LocaldbService
  ) {}

  async ngOnInit() {
    this.idViaje = this.route.snapshot.paramMap.get('id') || '';

    if (this.idViaje) {
      try {
        // Intentar cargar datos desde Firebase
        this.db.object(`viajes/${this.idViaje}`).valueChanges().subscribe(async (data: any) => {
          if (data) {
            this.viaje = data;
            await this.localdbService.guardar(`viaje_${this.idViaje}`, data); // Guardar en almacenamiento local
          } else {
            // Si no hay datos en Firebase, cargar desde almacenamiento local
            this.viaje = await this.localdbService.leer(`viaje_${this.idViaje}`);
            if (!this.viaje) {
              this.router.navigate(['/home']);
              this.mostrarToast('No se encontró el viaje.', 'warning');
            }
          }
        });

        // Cargar reservas asociadas
        this.loadReservas();
      } catch (error) {
        console.error('Error al cargar datos del viaje:', error);
        // Cargar desde almacenamiento local si hay un problema
        this.viaje = await this.localdbService.leer(`viaje_${this.idViaje}`);
        if (!this.viaje) {
          this.router.navigate(['/home']);
          this.mostrarToast('No se encontró el viaje.', 'warning');
        }
      }
    } else {
      this.router.navigate(['/home']);
      this.mostrarToast('ID de viaje no válido.', 'danger');
    }
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
    });
    await toast.present();
  }

  async presentConfirmAlert() {
    const alert = await this.alertController.create({
      header: 'Cancelar viaje',
      message: '¿Estás seguro de que deseas cancelar este viaje?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Sí',
          handler: () => {
            this.cancelarViaje();
          },
        },
      ],
    });
    await alert.present();
  }

  cancelarViaje() {
    if (this.idViaje) {
      this.db.object(`viajes/${this.idViaje}`).remove().then(async () => {
        this.router.navigate(['/home']);
        this.mostrarToast('Viaje cancelado correctamente.', 'success');
      }).catch(async (error) => {
        console.error('Error al cancelar el viaje:', error);
        this.mostrarToast('Error al cancelar el viaje.', 'danger');
      });
    }
  }

  iniciarRecorrido() {
    if (this.idViaje) {
      this.db.object(`viajes/${this.idViaje}`).update({ estado: 'iniciado' }).then(() => {
        this.router.navigate([`/viajeencurso/${this.idViaje}`]);
        this.mostrarToast('Viaje iniciado.', 'success');
      }).catch((error) => {
        console.error('Error al iniciar el viaje:', error);
        this.mostrarToast('Error al iniciar el viaje.', 'danger');
      });
    }
  }

  loadReservas() {
    this.db
      .list('reservas', (ref) => ref.orderByChild('idViaje').equalTo(this.idViaje))
      .valueChanges()
      .subscribe((reservas: any[]) => {
        this.reservas = reservas;
        // Guardar reservas localmente
        this.localdbService.guardar(`reservas_${this.idViaje}`, reservas);
      }, async (error) => {
        console.error('Error al cargar reservas:', error);
        // Cargar reservas desde almacenamiento local en caso de error
        const storedReservas = await this.localdbService.leer(`reservas_${this.idViaje}`);
        this.reservas = storedReservas || [];
      });
  }
}

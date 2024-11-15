import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
import { Reserva, Usuario, Viajes } from 'src/app/interfaces/iusuario';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.page.html',
  styleUrls: ['./reserva.page.scss'],
})
export class ReservaPage implements OnInit {
  viajes: any[] = [];
  usuarioId: string = '';
  nombreUsuario: string = '';
  apellidoUsuario: string = '';

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.afAuth.currentUser.then((user) => {
      if (user) {
        this.usuarioId = user.uid;

        // Obtener los viajes
        this.firestore.collection('viajes').get().subscribe((snapshot) => {
          snapshot.forEach((doc) => {
            const viajeData: any = doc.data();

            // Obtener datos del usuario que creó el viaje
            this.firestore
              .collection('usuarios')
              .doc(viajeData.idUsuario)
              .get()
              .subscribe((userDoc) => {
                if (userDoc.exists) {
                  const userData: Usuario = userDoc.data() as Usuario;
                  viajeData.nombreUsuario = userData.nombre || '';
                  viajeData.apellidoUsuario = userData.apellido || '';

                  // Agregar datos del vehículo
                  if (userData.vehiculo) {
                    viajeData.vehiculo = {
                      Marca: userData.vehiculo.Marca || '',
                      Modelo: userData.vehiculo.Modelo || '',
                      Patente: userData.vehiculo.Patente || '',
                    };
                  }
                }

                // Agregar el viaje al array de viajes
                this.viajes.push(viajeData);
              });
          });
          console.log('Viajes cargados:', this.viajes); // Verifica los viajes cargados
        });
      }
    }).catch(async (error) => {
      const toast = await this.toastController.create({
        message: `Error al cargar viajes: ${error.message}`,
        duration: 2000,
        position: 'top',
        color: 'danger',
      });
      await toast.present();
    });
  }

  // Función para mostrar el Toast y manejar la reserva
  async reservarViaje(viaje: any) {
    const toast = await this.toastController.create({
      message: `¿Estás seguro de reservar este viaje hacia ${viaje.Destino}?`,
      position: 'bottom',
      buttons: [
        {
          text: 'Confirmar',
          handler: () => {
            // Confirmar la reserva
            this.confirmarReserva(viaje);
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Reserva cancelada');
          },
        },
      ],
    });
    toast.present();
  }

// Método para confirmar la reserva y guardarla en Firestore
confirmarReserva(viaje: any) {
  this.afAuth.currentUser.then((user) => {
    if (user) {
      // Obtener los datos del usuario desde Firestore
      this.firestore.collection('usuarios').doc(user.uid).get().subscribe((userDoc) => {
        if (userDoc.exists) {
          // Cast para que TypeScript reconozca los campos nombre y apellido
          const userData = userDoc.data() as Usuario;

          // Asegurarse de que los campos 'nombre' y 'apellido' estén disponibles en Firestore
          const nombreUsuario = userData?.nombre || 'Sin nombre';
          const apellidoUsuario = userData?.apellido || 'Sin apellido';

          // Crear los datos de la reserva
          const reservaData: Reserva = {
            idUsuario: user.uid,  // ID del usuario que hace la reserva
            nombreUsuario: nombreUsuario,  // Nombre del pasajero
            apellidoUsuario: apellidoUsuario,  // Apellido del pasajero
            idViaje: viaje.idViaje,  // ID del viaje reservado
            idReserva: '',  // Firestore generará el ID automáticamente
          };

          // Agregar la reserva a la colección 'reservas' de Firestore
          this.firestore.collection('reservas').add(reservaData)
            .then((docRef) => {
              // El ID de la reserva se genera automáticamente por Firestore
              reservaData.idReserva = docRef.id;  // Asignar el ID generado por Firestore a la reserva
              console.log('Reserva confirmada y registrada con ID:', docRef.id);

              // Mostrar el mensaje de éxito
              this.toastController.create({
                message: '¡Reserva confirmada!',
                duration: 2000,
                position: 'bottom',
                color: 'success',
              }).then((toast) => toast.present());
            })
            .catch((error) => {
              console.error('Error al guardar la reserva:', error);
              this.toastController.create({
                message: 'Error al confirmar la reserva.',
                duration: 2000,
                position: 'bottom',
                color: 'danger',
              }).then((toast) => toast.present());
            });
        } else {
          console.error('No se encontraron los datos del usuario');
        }
      }, (error) => {
        console.error('Error al obtener los datos del usuario:', error);
        this.toastController.create({
          message: 'No se pudo obtener los datos del usuario.',
          duration: 2000,
          position: 'bottom',
          color: 'danger',
        }).then((toast) => toast.present());
      });
    }
  }).catch((error) => {
    console.error('Error al obtener el usuario:', error);
    this.toastController.create({
      message: 'No se pudo obtener la información del usuario.',
      duration: 2000,
      position: 'bottom',
      color: 'danger',
    }).then((toast) => toast.present());
  });
}
}
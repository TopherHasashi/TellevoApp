import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { LocaldbService } from './service/localdb.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from './interfaces/iusuario';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private afAuth: AngularFireAuth,
    private localdbService: LocaldbService,
    private router: Router,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(async (user) => {
      if (user) {
        console.log('Usuario autenticado:', user);

        // Recuperar la información del usuario desde Firestore
        const doc = await this.firestore.collection('usuarios').doc(user.uid).get().toPromise();
        if (doc?.exists) {
          const userData = doc.data() as Usuario; // Aplica la interfaz
          
          // Guardar toda la información en el almacenamiento local
          this.localdbService.guardar('user', {
            uid: user.uid,
            email: user.email,
            nombre: userData?.nombre || '',
            apellido: userData?.apellido || '',
            tieneAuto: !!userData?.Vehiculo, // Acceder a "Vehiculo" con la V mayúscula
            Vehiculo: userData?.Vehiculo || null, // Guardar el objeto completo "Vehiculo"
          });
          

          console.log('Datos del usuario guardados localmente:', userData);
        }
        // Redirigir al home
        this.router.navigate(['/home']);
      } else {
        console.log('No hay usuario autenticado.');
        this.localdbService.remover('user'); // Eliminar datos locales
        this.router.navigate(['/login']); // Redirigir al login
      }
    });
  }
}

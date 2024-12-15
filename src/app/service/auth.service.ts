import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { LocaldbService } from './localdb.service';
import { Usuario } from '../interfaces/iusuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private localdbService: LocaldbService
  ) {}

  async login(email: string, contrasena: string) {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, contrasena);
      console.log('Usuario autenticado:', result.user);

      if (result.user) {
        // Obtener datos adicionales del usuario desde Firestore
        const userDoc = await this.firestore.collection('usuarios').doc(result.user.uid).get().toPromise();
        if (userDoc?.exists) {
          const userData = userDoc.data() as Usuario;
          console.log('Datos del usuario obtenidos:', userData);

          // Guardar los datos en el almacenamiento local
          this.localdbService.guardar('user', {
            uid: result.user.uid,
            email: result.user.email,
            nombre: userData?.nombre || '',
            apellido: userData?.apellido || '',
            tieneAuto: !!userData?.vehiculo, // Comprueba si tiene auto
          });
        }

        this.router.navigate(['/home']); // Redirige al home
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }
}

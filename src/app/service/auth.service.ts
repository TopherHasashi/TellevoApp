import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { LocaldbService } from './localdb.service';
import { Usuario, Vehiculo } from '../interfaces/iusuario';

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

  redirectToHome() {
    this.router.navigate(['/home']);
  }

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
            tieneAuto: !!userData?.Vehiculo, // Comprueba si tiene auto
          });
        }

        this.router.navigate(['/home']); // Redirige al home
      }
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      this.showToast(
        error.code === 'auth/user-not-found'
          ? 'Usuario no existe'
          : error.code === 'auth/wrong-password'
          ? 'Contraseña incorrecta'
          : 'Usuario y/o contraseña incorrecta'
      );
      throw error; // Opcional: propaga el error si necesitas manejarlo más arriba
    }
  }

  private showToast(message: string) {
    // Crear el elemento del toast
    const toast = document.createElement('div');
    toast.textContent = message;

    // Estilos para posicionar el toast abajo y centrado
    toast.style.position = 'fixed';
    toast.style.bottom = '20px'; // A 20px del borde inferior
    toast.style.left = '50%'; // Centrar horizontalmente
    toast.style.transform = 'translateX(-50%)'; // Ajustar el centro exacto
    toast.style.backgroundColor = '#f44336'; // Color rojo para errores
    toast.style.color = '#fff'; // Texto blanco
    toast.style.padding = '10px 20px'; // Espaciado interno
    toast.style.borderRadius = '5px'; // Bordes redondeados
    toast.style.zIndex = '1000'; // Mostrar por encima de otros elementos
    toast.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    toast.style.fontSize = '14px'; // Tamaño de letra
    toast.style.textAlign = 'center'; // Centrar texto

    document.body.appendChild(toast);

    // Eliminar el toast después de 3 segundos
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  }
}
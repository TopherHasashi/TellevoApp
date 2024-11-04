import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private afAuth: AngularFireAuth,
    private router : Router) { }

  login(email:string, contrasena:string){

    return this.afAuth.signInWithEmailAndPassword(email,contrasena).then((result) => {
      console.log('Usuario logueado:', result.user);

      this.router.navigate(['/home']);

      return result.user
    })
    .catch((error) => {
      throw error;
    });
  }

}

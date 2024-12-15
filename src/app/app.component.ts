import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { LocaldbService } from './service/localdb.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private afAuth: AngularFireAuth,
    private localdbService: LocaldbService, // Servicio de almacenamiento local
    private router: Router
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(async (user) => {
      if (user) {
        console.log('Usuario autenticado:', user);

        // Guardar los datos del usuario en el almacenamiento local
        await this.localdbService.guardar('user', {
          uid: user.uid,
          email: user.email,
        });

        // Redirigir al home si no está ya en una ruta específica
        if (this.router.url === '/login') {
          this.router.navigate(['/home']);
        }
      } else {
        console.log('No hay usuario autenticado.');

        // Eliminar cualquier usuario almacenado localmente
        await this.localdbService.remover('user');

        // Redirigir al login solo si no está ya en esa página
        if (this.router.url !== '/login') {
          this.router.navigate(['/login']);
        }
      }
    });
  }
}

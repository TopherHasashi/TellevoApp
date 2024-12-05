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
      this.db.object(`viajes/${this.idViaje}`).update({ estado: 'finalizado' }).then(() => {
        console.log('Viaje finalizado correctamente');
        this.router.navigate(['/home']); // Redirigir al home
      }).catch((error) => {
        console.error('Error al finalizar el viaje:', error);
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-espera',
  templateUrl: './espera.page.html',
  styleUrls: ['./espera.page.scss'],
})
export class EsperaPage implements OnInit {
  reserva: any = {};
  idReserva: string = '';

  constructor(private route: ActivatedRoute, private db: AngularFireDatabase) {}

  ngOnInit() {
    this.idReserva = this.route.snapshot.paramMap.get('id') || '';
    if (this.idReserva) {
      this.db.object(`reservas/${this.idReserva}`).valueChanges().subscribe((data: any) => {
        this.reserva = data;
      });
    }
  }
}

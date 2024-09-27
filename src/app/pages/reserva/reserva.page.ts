import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.page.html',
  styleUrls: ['./reserva.page.scss'],
})
export class ReservaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  public toastButtons = [
    {
      text: 'Confirmo',
      role: 'accept',
    },
    {
      text: 'Cancelar',
      role: 'cancel',
    },
  ];
}

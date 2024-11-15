import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.page.html',
  styleUrls: ['./reserva.page.scss'],
})
export class ReservaPage implements OnInit {

  constructor() { }

    handleRefresh(event: { target: { complete: () => void; }; }) {
      setTimeout(() => {
        // Any calls to load data go here
        event.target.complete();
      }, 2000);
    }
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

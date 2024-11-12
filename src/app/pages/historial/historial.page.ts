import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  public toastButtons = [
    {
      text: 'Si',
      role: 'accept',
    },
    {
      text: 'No',
      role: 'cancel',
    },
  ];
}

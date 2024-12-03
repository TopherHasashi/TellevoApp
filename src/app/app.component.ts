import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {}

  async ngOnInit() {
    // Inicializa el almacenamiento
    this._storage = await this.storage.create();
  }

  // Métodos para guardar y obtener datos
  async setData(key: string, value: any) {
    await this._storage?.set(key, value);
  }

  async getData(key: string) {
    return await this._storage?.get(key);
  }
}

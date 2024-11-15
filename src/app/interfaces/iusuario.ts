import { Timestamp } from "firebase/firestore";

export interface Usuario{
    id:string,
    email:string,
    password:string,
    nombre:string,
    apellido:string,
    vehiculo?: Vehiculo;
}

export interface Vehiculo{
    idVehiculo:string,
    Patente:string,
    Modelo:string,
    Marca:string,
    Anio:number,
}

export interface Viajes{
    idViaje:string,
    Destino:string,
    Asientos:number,
    Costo:number,
   
}

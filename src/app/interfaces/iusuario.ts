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

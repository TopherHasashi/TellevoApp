export interface Usuario {
    id: string;
    email: string;
    password: string;
    nombre: string;
    apellido: string;
    vehiculo?: Vehiculo;
  }
  
  export interface Vehiculo {
    idVehiculo: string;
    Patente: string;
    Modelo: string;
    Marca: string;
    Anio: number;
  }
  
  export interface Viajes {
    idViaje: string;
    Destino: string;
    Asientos: number;
    Costo: number;
    idVehiculo: string;  // Agregamos el ID del vehículo asociado al viaje
    idUsuario: string;  // ID del usuario que creó el viaje
  }
  
  export interface Reserva {
    idConductor: string;
    idReserva: string;
    idUsuario: string;
    idViaje: string;
    nombreUsuario: string;
    apellidoUsuario: string;
    viaje?: Viajes;
  }
  
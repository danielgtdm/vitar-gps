import { TelemetriaVehiculo } from './telemetria-vehiculo.model';

export class ReporteWing {
  pv: string; //Patente Vehiculo
  fh: string; //Fecha Hora
  lt: number; //Latitud
  ln: number; //Longitud
  ph?: number; //Precisión Horizontal
  vg: number; //Velocidad GPS
  c: number; //Curso
  tv?: TelemetriaVehiculo; //Datos acerca del Vehículo
}

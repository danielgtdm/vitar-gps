import { PosicionAltitud } from '.';

export class PosicionVehiculo {
  VIN: string;
  TriggerType: string;
  CreatedDateTime: Date;
  ReceivedDateTime: Date;
  GNSSPosition: PosicionAltitud;
  WheelBasedSpeed: number;
}

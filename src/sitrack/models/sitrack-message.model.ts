export class SitrackMessage {
  message: string;
  time: string;
  eventType: number;
  gpsDop: number;
  gpsSatellites: number;
  gpsSpeed: number;
  heading: number;
  hourmeter: number;
  ignition: boolean;
  latitude: number;
  longitude: number;
  location?: string;
  odometer: number;
  rutTransporte: string;
  assetId: string;
}

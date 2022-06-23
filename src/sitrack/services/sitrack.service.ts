import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Configuration } from 'src/config/config.keys';
import { ConfigService } from 'src/config/config.service';
import { PosicionActualVehiculo, Vehiculo } from 'src/scania/models';
import { SitrackMessage } from '../models';

var format = require('date-format');
@Injectable()
export class SitrackService {
  private apiKey: string;
  constructor(
    private _httpService: HttpService,
    private _configService: ConfigService,
  ) {
    this.apiKey = this._configService.get(Configuration.SITRACK_API_KEY);
  }

  public async enviarReportes(
    reporte: PosicionActualVehiculo,
    vehiculos: Vehiculo[],
  ): Promise<void> {
    const mensajes = this.crearReporte(reporte, vehiculos);

    const config: AxiosRequestConfig = {
      baseURL: 'https://api.sitrack.io',
      maxRedirects: 20,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Apikey ' + this.apiKey,
        Accept: 'application/json',
      },
    };

    mensajes.forEach(async (mensaje) => {
      // this._httpService.post('/event/flow/message', mensaje, config).pipe(
      //  catchError((e) => {
      //    console.log(e);
      //
      //   throw new HttpException(e.response.data, e.response.status);
      //  }),
      // );

      const res = await firstValueFrom(
        this._httpService.post('/event/flow/message', mensaje, config),
      );
      console.log({
        triggerDate: res.data.triggerDate,
        triggerId: res.data.triggerId,
        status: res.status,
      });
    });
  }

  private crearReporte(
    reporte: PosicionActualVehiculo,
    vehiculos: Vehiculo[],
  ): SitrackMessage[] {
    let mensajes: SitrackMessage[] = [];

    reporte.VehiclePosition.forEach((vehiculo) => {
      const fechaReporte = new Date(vehiculo.GNSSPosition.PositionDateTime);

      let message: SitrackMessage = new SitrackMessage();
      message.message = 'events.bx.gps.report.test';
      message.time = format('yyyy-MM-dd hh:mm:ss', fechaReporte);
      message.eventType = 2; // Default Scania [TIMER]
      message.gpsDop = 1; // Default Scania [No Disponible]
      message.gpsSatellites = 0; // Default Scania [No Disponible]
      message.gpsSpeed = vehiculo.GNSSPosition.Speed;
      message.heading = vehiculo.GNSSPosition.Heading;
      message.hourmeter = 0;
      message.ignition = true; // Default Scania [No Disponible]
      message.latitude = vehiculo.GNSSPosition.Latitude;
      message.longitude = vehiculo.GNSSPosition.Longitude;
      //message.location = ''; [OPCIONAL]
      message.odometer = 0;
      message.rutTransporte = '762929058';

      message.assetId = vehiculos
        .find((v) => {
          return v.VIN === vehiculo.VIN;
        })
        .LicensePlate.replace(/-/g, '');

      mensajes.push(message);
    });

    return mensajes;
  }
}

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import { Configuration } from 'src/config/config.keys';
import { ConfigService } from 'src/config/config.service';
import { PosicionActualVehiculo, Vehiculo } from 'src/scania/models';
import { ReporteWing } from '../models';

var format = require('date-format');

@Injectable()
export class WingService {
  private apiKey: string;
  constructor(
    private _httpService: HttpService,
    private _configService: ConfigService,
  ) {
    this.apiKey = this._configService.get(Configuration.WING_API_KEY);
  }

  public async enviarReportes(
    reporte: PosicionActualVehiculo,
    vehiculos: Vehiculo[],
  ): Promise<void> {
    const mensajes = this.crearReporte(reporte, vehiculos);

    const config: AxiosRequestConfig = {
      baseURL: 'https://services.wing.cl',
      maxRedirects: 20,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.apiKey,
      },
    };

    mensajes.forEach(async (mensaje) => {
      const res = await firstValueFrom(
        this._httpService.post('/tracking/receiver/hub/v2', mensaje, config),
      );
      console.log(res.data);
    });
  }

  private crearReporte(
    reporteScania: PosicionActualVehiculo,
    vehiculos: Vehiculo[],
  ): ReporteWing[] {
    let reportes: ReporteWing[] = [];

    reporteScania.VehiclePosition.forEach((vehiculo) => {
      const fechaReporte = new Date(vehiculo.ReceivedDateTime);

      let reporte: ReporteWing = new ReporteWing();
      reporte.fh = format('yyyy-MM-dd hh:mm:ss', fechaReporte);
      reporte.ln = vehiculo.GNSSPosition.Longitude;
      reporte.lt = vehiculo.GNSSPosition.Latitude;
      reporte.vg = vehiculo.GNSSPosition.Speed;
      reporte.c = vehiculo.GNSSPosition.Heading;

      reporte.pv = vehiculos
        .find((v) => {
          return v.VIN === vehiculo.VIN;
        })
        .LicensePlate.replace(/-/g, '');

      reportes.push(reporte);
    });

    return reportes;
  }
}

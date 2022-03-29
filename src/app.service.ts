import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Vehiculo } from './scania/models';
import { ScaniaService } from './scania/services/scania.service';
import { SitrackService } from './sitrack/services/sitrack.service';
var format = require('date-format');

@Injectable()
export class AppService {
  private vehiculos: Vehiculo[];

  constructor(
    private _scaniaService: ScaniaService,
    private _sitrackService: SitrackService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  public async enviarPosicion() {
    if (!this.vehiculos) {
      this.vehiculos = (await this._scaniaService.getListaVehiculos()).Vehicle;
    }
    const posicionActual =
      await this._scaniaService.getPosicionActualVehiculo();

    this._sitrackService.enviarReportes(posicionActual, this.vehiculos);

    // console.log(this.vehiculos[0].LicensePlate);

    process.stdout.write(
      'Ultimo envio de datos: ' +
        format('yyyy-MM-dd hh:mm:ss', new Date()) +
        ' (Hora servidor local)\r',
    );
  }
}

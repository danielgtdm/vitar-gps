import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Vehiculo } from './scania/models';
import { ScaniaService } from './scania/services/scania.service';
import { SitrackService } from './sitrack/services/sitrack.service';
import { WingService } from './wing/services/wing.service';

@Injectable()
export class AppService {
  private vehiculos: Vehiculo[];

  constructor(
    private _scaniaService: ScaniaService,
    private _sitrackService: SitrackService,
    private _wingService: WingService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  public async enviarPosicion() {
    if (!this.vehiculos) {
      this.vehiculos = (await this._scaniaService.getListaVehiculos()).Vehicle;
    }
    const posicionActual =
      await this._scaniaService.getPosicionActualVehiculo();

    await this._sitrackService.enviarReportes(posicionActual, this.vehiculos);
    await this._wingService.enviarReportes(posicionActual, this.vehiculos);
  }
}

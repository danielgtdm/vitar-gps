import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ScaniaService } from './scania/services/scania.service';

@Injectable()
export class AppService {
  constructor(private _scaniaService: ScaniaService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async enviarPosicion() {
    const posicionActual =
      await this._scaniaService.getPosicionActualVehiculo();
    process.stdout.write(
      'Enviando datos: ' +
        posicionActual.RequestServerDateTime +
        ' (Hora servidor Scania)\r',
    );
  }
}

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig } from 'axios';
import { ListaVehiculo, PosicionActualVehiculo } from '../models';

@Injectable()
export class ScaniaService {
  public token: string;

  constructor(private _httpService: HttpService) {}

  public async getListaVehiculos(): Promise<ListaVehiculo> {
    const config: AxiosRequestConfig = {
      baseURL: 'https://dataaccess.scania.com',
      maxRedirects: 20,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie:
          'BIGipServerfmsauth.scania.com_https_pool=!yMn+bYcfDnu/A9y1w8PhYlkfHKys+k37x84FH+9vvDuGj3cbbsxqGiV6hRI0C0NjA9eNcFjm50ereQ==',
        Authorization: 'Bearer ' + this.token,
        Accept: 'application/json',
      },
    };
    const response = await firstValueFrom(
      this._httpService.get<ListaVehiculo>('/cs/vehicle/list/v1', config),
    );

    return response.data;
  }

  public async getPosicionActualVehiculo(): Promise<PosicionActualVehiculo> {
    const config: AxiosRequestConfig = {
      baseURL: 'https://dataaccess.scania.com',
      maxRedirects: 20,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie:
          'BIGipServerfmsauth.scania.com_https_pool=!yMn+bYcfDnu/A9y1w8PhYlkfHKys+k37x84FH+9vvDuGj3cbbsxqGiV6hRI0C0NjA9eNcFjm50ereQ==',
        Authorization: 'Bearer ' + this.token,
        Accept: 'application/json',
      },
    };
    const response = await firstValueFrom(
      this._httpService.get<PosicionActualVehiculo>(
        '/cs/vehicle/position/current/v1',
        config,
      ),
    );

    return response.data;
  }
}

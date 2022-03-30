import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';
import { stringify } from 'querystring';
import { firstValueFrom } from 'rxjs';
import { Configuration } from 'src/config/config.keys';
import { ConfigService } from 'src/config/config.service';
import { ResolveChallengeService } from './resolve-challenge.service';
import { ScaniaService } from './scania.service';

const options = {
  method: 'POST',
  hostname: 'fmsauth.scania.com',
  path: '/auth/S2S4DA/ClientId2Challenge',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Cookie:
      'BIGipServerfmsauth.scania.com_https_pool=!yMn+bYcfDnu/A9y1w8PhYlkfHKys+k37x84FH+9vvDuGj3cbbsxqGiV6hRI0C0NjA9eNcFjm50ereQ==',
  },
  maxRedirects: 20,
};

@Injectable()
export class AuthService {
  private clientId: string;
  private token: string;
  private refreshToken: string;
  constructor(
    private _resolveChallengeService: ResolveChallengeService,
    private _httpService: HttpService,
    private _configService: ConfigService,
    private _scaniaService: ScaniaService,
  ) {
    this.clientId = this._configService.get(Configuration.SCANIA_CLIENT_ID);
    this.start();
  }

  private async start(): Promise<void> {
    const reto = await this.getChallenge();
    const respuesta =
      this._resolveChallengeService.createChallengeResponse(reto);
    await this.getAPIToken(respuesta);
  }

  private async getChallenge() {
    const response = await firstValueFrom(
      this._httpService.post(
        'https://fmsauth.scania.com/auth/S2S4DA/ClientId2Challenge',
        stringify({ clientId: this.clientId }),
      ),
    );
    return response.data.challenge;
  }

  private async getAPIToken(respuesta: string) {
    const response = await firstValueFrom(
      this._httpService.post(
        'https://fmsauth.scania.com/auth/S2S4DA/Response2Token',
        stringify({
          clientId: this.clientId,
          Response: respuesta,
        }),
      ),
    );
    this.token = response.data.token;
    this.refreshToken = response.data.refreshToken;
    this._scaniaService.token = this.token;
  }

  @Cron('0 0-23/1 * * *')
  private async refreshTokens() {
    const response = await firstValueFrom(
      this._httpService.post(
        'https://fmsauth.scania.com/auth/S2S4DA/RefreshToken',
        stringify({
          clientId: this.clientId,
          RefreshToken: this.refreshToken,
        }),
      ),
    );
    this.token = response.data.token;
    this.refreshToken = response.data.refreshToken;
    this._scaniaService.token = this.token;
  }
}

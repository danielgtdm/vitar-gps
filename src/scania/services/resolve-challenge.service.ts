import { Injectable } from '@nestjs/common';
import { HmacSHA256 } from 'crypto-js';
import { enc } from 'crypto-js';
import { Configuration } from 'src/config/config.keys';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class ResolveChallengeService {
  private secretKey: string;

  constructor(private _configService: ConfigService) {
    this.secretKey = this._configService.get(Configuration.SCANIA_SECRET_KEY);
  }

  public createChallengeResponse(challenge: string) {
    process.stdout.write('Resolviendo reto...\r');
    const secretKeyArr = this.base64url_decode(this.secretKey);
    const challengeArr = this.base64url_decode(challenge);
    const challengeResponse = HmacSHA256(challengeArr, secretKeyArr);

    return this.base64url_encode(challengeResponse);
  }

  private base64url_encode(arg) {
    let s = enc.Base64.stringify(arg);
    s = s.split('=')[0];
    s = s.replace(/\+/g, '-');
    s = s.replace(/\//g, '_');

    return s;
  }

  private base64url_decode(arg) {
    let s = arg;
    s = s.replace(/-/g, '+');
    s = s.replace(/_/g, '/');
    switch (s.length % 4) {
      case 0:
        break;
      case 2:
        s += '==';
        break;
      case 3:
        s += '=';
        break;
      default:
        console.log('Illegal base64url string!');
    }
    console.clear();
    return enc.Base64.parse(s);
  }
}

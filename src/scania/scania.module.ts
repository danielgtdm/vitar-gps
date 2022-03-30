import { Module } from '@nestjs/common';
import { ResolveChallengeService } from './services/resolve-challenge.service';
import { AuthService } from './services/auth.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from 'src/config/config.module';
import { ScaniaService } from './services/scania.service';
@Module({
  providers: [ResolveChallengeService, AuthService, ScaniaService],
  imports: [
    ConfigModule,
    HttpModule.register({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie:
          'BIGipServerfmsauth.scania.com_https_pool=!yMn+bYcfDnu/A9y1w8PhYlkfHKys+k37x84FH+9vvDuGj3cbbsxqGiV6hRI0C0NjA9eNcFjm50ereQ==',
      },
      maxRedirects: 20,
    }),
  ],
  exports: [AuthService, ResolveChallengeService, ScaniaService],
})
export class ScaniaModule {}

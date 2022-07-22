import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScaniaModule } from './scania/scania.module';
import { SitrackModule } from './sitrack/sitrack.module';
import { ConfigModule } from './config/config.module';
import { ScheduleModule } from '@nestjs/schedule';
import { WingModule } from './wing/wing.module';

@Module({
  imports: [
    ScaniaModule,
    SitrackModule,
    ConfigModule,
    ScheduleModule.forRoot(),
    WingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

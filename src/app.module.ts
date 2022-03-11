import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScaniaModule } from './scania/scania.module';
import { SitrackModule } from './sitrack/sitrack.module';

@Module({
  imports: [ScaniaModule, SitrackModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

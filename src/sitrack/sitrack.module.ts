import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { SitrackService } from './services/sitrack.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [SitrackService],
  exports: [SitrackService],
})
export class SitrackModule {}

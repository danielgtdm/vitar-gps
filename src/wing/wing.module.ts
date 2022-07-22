import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { WingService } from './services/wing.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [WingService],
  exports: [WingService],
})
export class WingModule {}

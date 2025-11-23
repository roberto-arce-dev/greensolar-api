import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MonitoreoConsumoService } from './monitoreoconsumo.service';
import { MonitoreoConsumoController } from './monitoreoconsumo.controller';
import { UploadModule } from '../upload/upload.module';
import { MonitoreoConsumo, MonitoreoConsumoSchema } from './schemas/monitoreoconsumo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MonitoreoConsumo.name, schema: MonitoreoConsumoSchema }]),
    UploadModule,
  ],
  controllers: [MonitoreoConsumoController],
  providers: [MonitoreoConsumoService],
  exports: [MonitoreoConsumoService],
})
export class MonitoreoConsumoModule {}

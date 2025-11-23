import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProyectoSolarService } from './proyectosolar.service';
import { ProyectoSolarController } from './proyectosolar.controller';
import { UploadModule } from '../upload/upload.module';
import { ProyectoSolar, ProyectoSolarSchema } from './schemas/proyectosolar.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ProyectoSolar.name, schema: ProyectoSolarSchema }]),
    UploadModule,
  ],
  controllers: [ProyectoSolarController],
  providers: [ProyectoSolarService],
  exports: [ProyectoSolarService],
})
export class ProyectoSolarModule {}

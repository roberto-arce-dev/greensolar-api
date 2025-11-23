import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CotizacionService } from './cotizacion.service';
import { CotizacionController } from './cotizacion.controller';
import { UploadModule } from '../upload/upload.module';
import { Cotizacion, CotizacionSchema } from './schemas/cotizacion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cotizacion.name, schema: CotizacionSchema }]),
    UploadModule,
  ],
  controllers: [CotizacionController],
  providers: [CotizacionService],
  exports: [CotizacionService],
})
export class CotizacionModule {}

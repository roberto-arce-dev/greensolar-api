import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InstaladorService } from './instalador.service';
import { InstaladorController } from './instalador.controller';
import { UploadModule } from '../upload/upload.module';
import { Instalador, InstaladorSchema } from './schemas/instalador.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Instalador.name, schema: InstaladorSchema }]),
    UploadModule,
  ],
  controllers: [InstaladorController],
  providers: [InstaladorService],
  exports: [InstaladorService],
})
export class InstaladorModule {}

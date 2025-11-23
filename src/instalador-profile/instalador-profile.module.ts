import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InstaladorProfile, InstaladorProfileSchema } from './schemas/instalador-profile.schema';
import { InstaladorProfileService } from './instalador-profile.service';
import { InstaladorProfileController } from './instalador-profile.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InstaladorProfile.name, schema: InstaladorProfileSchema },
    ]),
  ],
  controllers: [InstaladorProfileController],
  providers: [InstaladorProfileService],
  exports: [InstaladorProfileService],
})
export class InstaladorProfileModule {}

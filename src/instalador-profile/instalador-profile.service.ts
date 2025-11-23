import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InstaladorProfile, InstaladorProfileDocument } from './schemas/instalador-profile.schema';
import { CreateInstaladorProfileDto } from './dto/create-instalador-profile.dto';
import { UpdateInstaladorProfileDto } from './dto/update-instalador-profile.dto';

@Injectable()
export class InstaladorProfileService {
  constructor(
    @InjectModel(InstaladorProfile.name) private instaladorprofileModel: Model<InstaladorProfileDocument>,
  ) {}

  async create(userId: string, dto: CreateInstaladorProfileDto): Promise<InstaladorProfile> {
    const profile = await this.instaladorprofileModel.create({
      user: userId,
      ...dto,
    });
    return profile;
  }

  async findByUserId(userId: string): Promise<InstaladorProfile | null> {
    return this.instaladorprofileModel.findOne({ user: userId }).populate('user', 'email role').exec();
  }

  async findAll(): Promise<InstaladorProfile[]> {
    return this.instaladorprofileModel.find().populate('user', 'email role').exec();
  }

  async update(userId: string, dto: UpdateInstaladorProfileDto): Promise<InstaladorProfile> {
    const profile = await this.instaladorprofileModel.findOneAndUpdate(
      { user: userId },
      { $set: dto },
      { new: true },
    );
    if (!profile) {
      throw new NotFoundException('Profile no encontrado');
    }
    return profile;
  }

  async delete(userId: string): Promise<void> {
    const result = await this.instaladorprofileModel.deleteOne({ user: userId });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Profile no encontrado');
    }
  }
}

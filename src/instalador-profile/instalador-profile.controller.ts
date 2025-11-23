import { Controller, Get, Post, Put, Delete, Body, Param, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { InstaladorProfileService } from './instalador-profile.service';
import { CreateInstaladorProfileDto } from './dto/create-instalador-profile.dto';
import { UpdateInstaladorProfileDto } from './dto/update-instalador-profile.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';

@ApiTags('instalador-profile')
@ApiBearerAuth()
@Controller('instalador-profile')
export class InstaladorProfileController {
  constructor(private readonly instaladorprofileService: InstaladorProfileService) {}

  @Get('me')
  @Roles(Role.INSTALADOR)
  @ApiOperation({ summary: 'Obtener mi perfil' })
  async getMyProfile(@Request() req) {
    return this.instaladorprofileService.findByUserId(req.user.id);
  }

  @Put('me')
  @Roles(Role.INSTALADOR)
  @ApiOperation({ summary: 'Actualizar mi perfil' })
  async updateMyProfile(@Request() req, @Body() dto: UpdateInstaladorProfileDto) {
    return this.instaladorprofileService.update(req.user.id, dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Listar todos los perfiles (Admin)' })
  async findAll() {
    return this.instaladorprofileService.findAll();
  }

  @Get(':userId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obtener perfil por userId (Admin)' })
  async findByUserId(@Param('userId') userId: string) {
    return this.instaladorprofileService.findByUserId(userId);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { InstaladorService } from './instalador.service';
import { CreateInstaladorDto } from './dto/create-instalador.dto';
import { UpdateInstaladorDto } from './dto/update-instalador.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('Instalador')
@ApiBearerAuth('JWT-auth')
@Controller('instalador')
export class InstaladorController {
  constructor(
    private readonly instaladorService: InstaladorService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo Instalador' })
  @ApiBody({ type: CreateInstaladorDto })
  @ApiResponse({ status: 201, description: 'Instalador creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createInstaladorDto: CreateInstaladorDto) {
    const data = await this.instaladorService.create(createInstaladorDto);
    return {
      success: true,
      message: 'Instalador creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Instalador' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Instalador' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Imagen subida exitosamente' })
  @ApiResponse({ status: 404, description: 'Instalador no encontrado' })
  async uploadImage(
    @Param('id') id: string,
    @Req() request: FastifyRequest,
  ) {
    // Obtener archivo de Fastify
    const data = await request.file();

    if (!data) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    if (!data.mimetype.startsWith('image/')) {
      throw new BadRequestException('El archivo debe ser una imagen');
    }

    const buffer = await data.toBuffer();
    const file = {
      buffer,
      originalname: data.filename,
      mimetype: data.mimetype,
    } as Express.Multer.File;

    const uploadResult = await this.uploadService.uploadImage(file);
    const updated = await this.instaladorService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { instalador: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los Instaladors' })
  @ApiResponse({ status: 200, description: 'Lista de Instaladors' })
  async findAll() {
    const data = await this.instaladorService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener Instalador por ID' })
  @ApiParam({ name: 'id', description: 'ID del Instalador' })
  @ApiResponse({ status: 200, description: 'Instalador encontrado' })
  @ApiResponse({ status: 404, description: 'Instalador no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.instaladorService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar Instalador' })
  @ApiParam({ name: 'id', description: 'ID del Instalador' })
  @ApiBody({ type: UpdateInstaladorDto })
  @ApiResponse({ status: 200, description: 'Instalador actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Instalador no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateInstaladorDto: UpdateInstaladorDto
  ) {
    const data = await this.instaladorService.update(id, updateInstaladorDto);
    return {
      success: true,
      message: 'Instalador actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar Instalador' })
  @ApiParam({ name: 'id', description: 'ID del Instalador' })
  @ApiResponse({ status: 200, description: 'Instalador eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Instalador no encontrado' })
  async remove(@Param('id') id: string) {
    const instalador = await this.instaladorService.findOne(id);
    if (instalador.imagen) {
      const filename = instalador.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.instaladorService.remove(id);
    return { success: true, message: 'Instalador eliminado exitosamente' };
  }
}

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
import { MonitoreoConsumoService } from './monitoreoconsumo.service';
import { CreateMonitoreoConsumoDto } from './dto/create-monitoreoconsumo.dto';
import { UpdateMonitoreoConsumoDto } from './dto/update-monitoreoconsumo.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('MonitoreoConsumo')
@ApiBearerAuth('JWT-auth')
@Controller('monitoreo-consumo')
export class MonitoreoConsumoController {
  constructor(
    private readonly monitoreoconsumoService: MonitoreoConsumoService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo MonitoreoConsumo' })
  @ApiBody({ type: CreateMonitoreoConsumoDto })
  @ApiResponse({ status: 201, description: 'MonitoreoConsumo creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createMonitoreoConsumoDto: CreateMonitoreoConsumoDto) {
    const data = await this.monitoreoconsumoService.create(createMonitoreoConsumoDto);
    return {
      success: true,
      message: 'MonitoreoConsumo creado exitosamente',
      data,
    };
  }

  @Post(':id/upload-image')
  @ApiOperation({ summary: 'Subir imagen para Monitoreoconsumo' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del Monitoreoconsumo' })
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
  @ApiResponse({ status: 404, description: 'Monitoreoconsumo no encontrado' })
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
    const updated = await this.monitoreoconsumoService.update(id, {
      imagen: uploadResult.url,
      imagenThumbnail: uploadResult.thumbnailUrl,
    });
    return {
      success: true,
      message: 'Imagen subida y asociada exitosamente',
      data: { monitoreoconsumo: updated, upload: uploadResult },
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los MonitoreoConsumos' })
  @ApiResponse({ status: 200, description: 'Lista de MonitoreoConsumos' })
  async findAll() {
    const data = await this.monitoreoconsumoService.findAll();
    return { success: true, data, total: data.length };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener MonitoreoConsumo por ID' })
  @ApiParam({ name: 'id', description: 'ID del MonitoreoConsumo' })
  @ApiResponse({ status: 200, description: 'MonitoreoConsumo encontrado' })
  @ApiResponse({ status: 404, description: 'MonitoreoConsumo no encontrado' })
  async findOne(@Param('id') id: string) {
    const data = await this.monitoreoconsumoService.findOne(id);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar MonitoreoConsumo' })
  @ApiParam({ name: 'id', description: 'ID del MonitoreoConsumo' })
  @ApiBody({ type: UpdateMonitoreoConsumoDto })
  @ApiResponse({ status: 200, description: 'MonitoreoConsumo actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'MonitoreoConsumo no encontrado' })
  async update(
    @Param('id') id: string, 
    @Body() updateMonitoreoConsumoDto: UpdateMonitoreoConsumoDto
  ) {
    const data = await this.monitoreoconsumoService.update(id, updateMonitoreoConsumoDto);
    return {
      success: true,
      message: 'MonitoreoConsumo actualizado exitosamente',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar MonitoreoConsumo' })
  @ApiParam({ name: 'id', description: 'ID del MonitoreoConsumo' })
  @ApiResponse({ status: 200, description: 'MonitoreoConsumo eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'MonitoreoConsumo no encontrado' })
  async remove(@Param('id') id: string) {
    const monitoreoconsumo = await this.monitoreoconsumoService.findOne(id);
    if (monitoreoconsumo.imagen) {
      const filename = monitoreoconsumo.imagen.split('/').pop();
      if (filename) {
      await this.uploadService.deleteImage(filename);
      }
    }
    await this.monitoreoconsumoService.remove(id);
    return { success: true, message: 'MonitoreoConsumo eliminado exitosamente' };
  }
}

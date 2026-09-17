import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { RegistrationsService } from '../../application/registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import { RegistrationResponseDto } from './dto/registration-response.dto';

@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly _service: RegistrationsService) {}

  @Post()
  async create(@Body() dto: CreateRegistrationDto): Promise<RegistrationResponseDto> {
    const reg = await this._service.create(dto);
    const breakdown = await this._service.computeBreakdown(reg);
    return RegistrationResponseDto.from(reg, breakdown);
  }

  @Get(':token')
  async findByToken(
    @Param('token') token: string,
    @Query('email') email: string,
  ): Promise<RegistrationResponseDto> {
    if (!email) throw new BadRequestException('email query param is required');
    const reg = await this._service.findByTokenAndEmail(token, email);
    const breakdown = await this._service.computeBreakdown(reg);
    return RegistrationResponseDto.from(reg, breakdown);
  }

  @Patch(':token')
  async update(
    @Param('token') token: string,
    @Query('email') email: string,
    @Body() dto: UpdateRegistrationDto,
  ): Promise<RegistrationResponseDto> {
    if (!email) throw new BadRequestException('email query param is required');
    const reg = await this._service.update(token, email, dto);
    const breakdown = await this._service.computeBreakdown(reg);
    return RegistrationResponseDto.from(reg, breakdown);
  }

  @Delete(':token')
  async cancel(
    @Param('token') token: string,
    @Query('email') email: string,
  ): Promise<RegistrationResponseDto> {
    if (!email) throw new BadRequestException('email query param is required');
    const reg = await this._service.cancel(token, email);
    const breakdown = await this._service.computeBreakdown(reg);
    return RegistrationResponseDto.from(reg, breakdown);
  }
}

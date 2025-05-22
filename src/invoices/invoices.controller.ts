// src/invoices/invoices.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('projects/:projectId/invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.CONTRACTOR)
  create(
    @Param('projectId') projectId: string,
    @Body() createInvoiceDto: CreateInvoiceDto,
    @Req() req,
  ) {
    return this.invoicesService.create(+projectId, {
      ...createInvoiceDto,
      contractorId: req.user.id,
    });
  }

  @Get()
  @Roles(
    UserRole.ADMIN,
    UserRole.CLIENT,
    UserRole.CONTRACTOR,
    UserRole.SITE_ENGINEER,
  )
  findAll(@Param('projectId') projectId: string) {
    return this.invoicesService.findAllForProject(+projectId);
  }

  @Patch(':id/pay')
  @Roles(UserRole.ADMIN, UserRole.CLIENT)
  markAsPaid(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ) {
    return this.invoicesService.markAsPaid(+id, updateInvoiceDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.invoicesService.remove(+id);
  }
}

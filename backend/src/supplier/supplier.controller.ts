/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { SupplierService } from "./supplier.service";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { Supplier } from "./entities/supplier.entity";



@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  // Create a new supplier
  @Post()
  async create(@Body() createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    return await this.supplierService.create(createSupplierDto);
  }

  // Get all suppliers
  @Get()
  async findAll(): Promise<Supplier[]> {
    return await this.supplierService.findAll();
  }

  // Get a supplier by idSupplier
  @Get(':idSupplier')
  async findOne(@Param('idSupplier', ParseIntPipe) idSupplier: number): Promise<Supplier> {
    return await this.supplierService.findOne(idSupplier);
  }

  // Update a supplier by idSupplier
  @Put(':idSupplier')
  async update(
    @Param('idSupplier', ParseIntPipe) idSupplier: number,
    @Body() updateSupplierDto: CreateSupplierDto,
  ): Promise<Supplier> {
    return await this.supplierService.update(idSupplier, updateSupplierDto);
  }

  // Delete a supplier by idSupplier
  @Delete(':idSupplier')
  async remove(@Param('idSupplier', ParseIntPipe) idSupplier: number): Promise<void> {
    return await this.supplierService.remove(idSupplier);
  }

  // Get supplier(s) by product ID
  @Get('by-product/:productId')
  async getSuppliersByProductId(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<Supplier[]> {
    return await this.supplierService.getSuppliersByProductId(productId);
  }
  


}

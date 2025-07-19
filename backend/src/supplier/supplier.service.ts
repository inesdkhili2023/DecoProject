/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Supplier } from './entities/supplier.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { Product } from 'src/product/entities/product.entity';


@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // Add a new supplier
  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    const {
      nameCompany,
      phone,
      place,
      field,
      taxCode,
      dealDate,
    } = createSupplierDto;

    const supplier = this.supplierRepository.create({
      nameCompany,
      phone,
      place,
      field,
      taxCode,
      dealDate: new Date(dealDate),
    });

    return await this.supplierRepository.save(supplier);
  }

  // Get all suppliers
  async findAll(): Promise<Supplier[]> {
    return await this.supplierRepository.find();
  }

  // Get supplier by ID 
  async findOne(idSupplier: number): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({
      where: { idSupplier },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    return supplier;
  }

  // Update supplier
  async update(idSupplier: number, updateSupplierDto: CreateSupplierDto): Promise<Supplier> {
    const supplier = await this.findOne(idSupplier);

    Object.assign(supplier, updateSupplierDto);

    return await this.supplierRepository.save(supplier);
  }

  // Delete supplier
  async remove(idSupplier: number): Promise<void> {
    const supplier = await this.findOne(idSupplier);

    await this.supplierRepository.remove(supplier);
  }

  // Get suppliers by product ID
  async getSuppliersByProductId(productId: number): Promise<Supplier[]> {
    const product = await this.productRepository.findOne({
      where: { idProduct: productId },
      relations: ['supplier'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return [product.supplier];
  }



}

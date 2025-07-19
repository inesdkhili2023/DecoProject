import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Transporter } from "./entities/transporter.entity";
import { Repository } from "typeorm";
import { CreateTransporterDto } from "./dto/transporter.dto";


@Injectable()
export class TransporterService {
  constructor(
    @InjectRepository(Transporter)
    private transporterRepository: Repository<Transporter>,
  ) {}

  // Create Transporter
  async createTransporter(dto: CreateTransporterDto): Promise<Transporter> {
  const newTransporter = this.transporterRepository.create(dto);
  return await this.transporterRepository.save(newTransporter);
}

  // Get all transporters
  async getAll(): Promise<Transporter[]> {
    return await this.transporterRepository.find();
  }

  // Get transporter by ID
  async getById(id: number): Promise<Transporter> {
    const transporter = await this.transporterRepository.findOne({
      where: { idTransporter: id },
    });

    if (!transporter) {
      throw new NotFoundException(`Transporter with ID ${id} not found`);
    }

    return transporter;
  }

  // Update transporter
  async updateTransporter(
    id: number,
    dto: Partial<CreateTransporterDto>,
  ): Promise<Transporter> {
    const transporter = await this.getById(id);

    // If phones field is provided, directly use it as an array
    if (dto.phones) {
      dto.phones = dto.phones; // No serialization needed, use the array directly
    }

    // Update the transporter entity with the new values
    const updated = Object.assign(transporter, dto);

    // Save the updated transporter entity
    return await this.transporterRepository.save(updated);
  }

  // Delete transporter
  async deleteTransporter(id: number): Promise<void> {
    const result = await this.transporterRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Transporter with ID ${id} not found`);
    }
  }
}
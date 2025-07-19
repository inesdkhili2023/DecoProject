import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { TransporterService } from "./transporter.service";
import { CreateTransporterDto } from "./dto/transporter.dto";
import { Transporter } from "./entities/transporter.entity";

@Controller('transporter')
export class TransporterController {
    constructor(private readonly transporterService: TransporterService) {}

    @Post()
    async create(@Body() createTransporterDto: CreateTransporterDto): Promise<Transporter> {
      return this.transporterService.createTransporter(createTransporterDto);
    }
  
    // Get all transporters
    @Get()
    async findAll(): Promise<Transporter[]> {
      return this.transporterService.getAll();
    }
  
    // Get a transporter by ID
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Transporter> {
      return this.transporterService.getById(id);
    }
  
    // Update a transporter
    @Put(':id')
    async update(
      @Param('id') id: number,
      @Body() updateTransporterDto: Partial<CreateTransporterDto>,
    ): Promise<Transporter> {
      return this.transporterService.updateTransporter(id, updateTransporterDto);
    }
  
    // Delete a transporter
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<void> {
      return this.transporterService.deleteTransporter(id);
    }
}
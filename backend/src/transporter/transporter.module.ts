import { Module } from '@nestjs/common';
import { TransporterService } from './transporter.service';
import { TransporterController } from './transporter.controller';
import { Transporter } from './entities/transporter.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Transporter]),],
  controllers: [TransporterController],
  providers: [TransporterService],
   exports: [TypeOrmModule]


})
export class TransporterModule {}

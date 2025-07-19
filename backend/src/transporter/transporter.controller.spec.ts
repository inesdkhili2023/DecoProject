import { Test, TestingModule } from '@nestjs/testing';
import { TransporterController } from './transporter.controller';
import { TransporterService } from './transporter.service';

describe('TransporterController', () => {
  let controller: TransporterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransporterController],
      providers: [TransporterService],
    }).compile();

    controller = module.get<TransporterController>(TransporterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { TransporterService } from './transporter.service';

describe('TransporterService', () => {
  let service: TransporterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransporterService],
    }).compile();

    service = module.get<TransporterService>(TransporterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ItemCartService } from './item-cart.service';

describe('ItemCartService', () => {
  let service: ItemCartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemCartService],
    }).compile();

    service = module.get<ItemCartService>(ItemCartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

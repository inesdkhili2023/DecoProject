import { Test, TestingModule } from '@nestjs/testing';
import { ItemCartController } from './item-cart.controller';
import { ItemCartService } from './item-cart.service';

describe('ItemCartController', () => {
  let controller: ItemCartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemCartController],
      providers: [ItemCartService],
    }).compile();

    controller = module.get<ItemCartController>(ItemCartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

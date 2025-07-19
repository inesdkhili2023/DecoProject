import { Controller } from '@nestjs/common';
import { ItemCartService } from './item-cart.service';

@Controller('item-cart')
export class ItemCartController {
  constructor(private readonly itemCartService: ItemCartService) {}
}

import {Controller, Get} from '@nestjs/common';
import { Item } from './models';
import {ItemsService} from "./items.service";

@Controller('v1/items')
export class ItemsController {

  constructor(private itemService: ItemsService) {
  }

  @Get()
  getItems(): Item[] {
    return this.itemService.findItems();
  }

}

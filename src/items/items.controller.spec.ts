import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import {ItemsService} from "./items.service";

describe('ItemsController', () => {
  let controller: ItemsController;
  let service: ItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemsService],
      controllers: [ItemsController],
    }).compile();

    controller = module.get<ItemsController>(ItemsController);
    service = module.get<ItemsService>(ItemsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return list of items', function () {
    const items = [];
    jest.spyOn(service, 'findItems').mockImplementation(() => items);
    expect(controller.getItems()).toBe(items);
  });
});

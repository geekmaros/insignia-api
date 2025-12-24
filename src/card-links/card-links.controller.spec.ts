import { Test, TestingModule } from '@nestjs/testing';
import { CardLinksController } from './card-links.controller';
import { CardLinksService } from './card-links.service';

describe('CardLinksController', () => {
  let controller: CardLinksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardLinksController],
      providers: [CardLinksService],
    }).compile();

    controller = module.get<CardLinksController>(CardLinksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

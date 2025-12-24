import { Test, TestingModule } from '@nestjs/testing';
import { CardLinksService } from './card-links.service';

describe('CardLinksService', () => {
  let service: CardLinksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardLinksService],
    }).compile();

    service = module.get<CardLinksService>(CardLinksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

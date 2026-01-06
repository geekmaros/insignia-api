import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateCardAppearanceDto } from './dto/create-card-appearance.dto';
import { UpdateCardAppearanceDto } from './dto/update-card-appearance.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CardAppearanceService {
  constructor(private readonly databaseService: DatabaseService) {}
  async upsert(
    userId: number,
    cardId: number,
    updateCardAppearanceDto: UpdateCardAppearanceDto,
  ) {
    const card = await this.databaseService.card.findFirst({
      where: { id: cardId, userId },
    });

    if (!card) throw new ForbiddenException('Access denied');

    const appearance = await this.databaseService.cardAppearance.upsert({
      where: { cardId },
      update: {
        theme: updateCardAppearanceDto.theme,
        logoUrl: updateCardAppearanceDto.logoUrl,
        config: updateCardAppearanceDto.config,
      },
      create: {
        cardId,
        theme: updateCardAppearanceDto.theme,
        logoUrl: updateCardAppearanceDto.logoUrl,
        config: updateCardAppearanceDto.config,
      },
    });

    return appearance;
  }
}

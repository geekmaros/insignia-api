import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCardLinkDto } from './dto/create-card-link.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CardLinksService {
  constructor(private readonly databaseService: DatabaseService) {}

  async addLink(
    userId: number,
    cardId: number,
    createCardLinkDto: CreateCardLinkDto,
  ) {
    const card = await this.databaseService.card.findUnique({
      where: {
        id: cardId,
      },
    });
    if (!card) throw new NotFoundException();
    if (card.userId !== userId) throw new ForbiddenException();

    const position =
      createCardLinkDto.position ??
      (await this.databaseService.cardLink.count({
        where: {
          cardId,
        },
      }));

    return this.databaseService.cardLink.create({
      data: {
        cardId,
        type: createCardLinkDto.type,
        label: createCardLinkDto.label,
        value: createCardLinkDto.value,
        position: position,
      },
    });
  }
}

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCardLinkDto } from './dto/create-card-link.dto';
import { DatabaseService } from '../database/database.service';
import { UpdateCardLinkDto } from './dto/update-card-link.dto';

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

  async updateLink(
    userId: number,
    cardId: number,
    linkId: number,
    updateCardLinkDto: UpdateCardLinkDto,
  ) {
    const card = await this.databaseService.card.findUnique({
      where: {
        id: cardId,
      },
    });

    if (!card) throw new NotFoundException('Card not found');
    if (card.userId !== userId) throw new ForbiddenException();

    const link = await this.databaseService.cardLink.findFirst({
      where: {
        id: linkId,
        cardId,
      },
    });

    if (!link) throw new NotFoundException('Card Link not found');

    return this.databaseService.cardLink.update({
      where: {
        id: linkId,
      },
      data: {
        type: updateCardLinkDto.type ?? undefined,
        label: updateCardLinkDto.label ?? undefined,
        value: updateCardLinkDto.value ?? undefined,
        position: updateCardLinkDto.position ?? undefined,
        isActive: updateCardLinkDto.isActive ?? undefined,
      },
    });
  }

  async removeLink(userId: number, cardId: number, linkId: number) {
    const card = await this.databaseService.card.findUnique({
      where: { id: cardId },
    });

    if (!card) throw new NotFoundException('Card not found');
    if (card.userId !== userId) throw new ForbiddenException();

    const link = await this.databaseService.cardLink.findUnique({
      where: {
        id: linkId,
        cardId,
      },
    });

    if (!link) throw new NotFoundException('Link not found in card link');

    return this.databaseService.cardLink.update({
      where: { id: linkId },
      data: {
        isActive: false,
      },
    });
  }
}

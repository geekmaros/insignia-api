import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { DatabaseService } from '../database/database.service';
import { use } from 'passport';

@Injectable()
export class CardsService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(userId: number, createCardDto: CreateCardDto) {
    return this.databaseService.card.create({
      data: {
        userId,
        displayName: createCardDto.displayName,
        title: createCardDto.title,
        slug: createCardDto.slug,
        company: createCardDto.company,
      },
      select: {
        id: true,
        userId: true,
        displayName: true,
        title: true,
        slug: true,
        company: true,
        isActive: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findPublicBySlug(slug: string) {
    const card = await this.databaseService.card.findFirst({
      where: {
        slug,
        isPublic: true,
        isActive: true,
      },
      include: {
        links: {
          where: { isActive: true },
          orderBy: { position: 'asc' },
        },
        appearance: true,
      },
    });

    if (!card) throw new NotFoundException('Card not found');
    return card;
  }

  async findAll(userId: number) {
    return this.databaseService.card.findMany({
      where: { userId: userId },
    });
  }

  async findOwnedById(userId: number, cardId: number) {
    const card = await this.databaseService.card.findUnique({
      where: {
        id: cardId,
      },
    });

    if (!card) throw new NotFoundException('Card not found');
    if (card.userId !== userId) throw new ForbiddenException();
    return card;
  }

  async updateOwned(
    userId: number,
    cardId: number,
    updateCardDto: UpdateCardDto,
  ) {
    const card = await this.databaseService.card.findUnique({
      where: { id: cardId },
    });

    if (!card) throw new NotFoundException('Card not found');
    if (card.userId !== userId) throw new ForbiddenException('Not your card');

    return this.databaseService.card.update({
      where: { id: cardId },
      data: {
        displayName: updateCardDto.displayName ?? undefined,
        slug: updateCardDto.slug ?? undefined,
        title: updateCardDto.title ?? undefined,
        company: updateCardDto.company ?? undefined,
        prefix: updateCardDto.prefix ?? undefined,
        suffix: updateCardDto.suffix ?? undefined,
        accreditation: updateCardDto.accreditation ?? undefined,
        department: updateCardDto.department ?? undefined,
        headline: updateCardDto.headline ?? undefined,
        isPublic: updateCardDto.isPublic ?? undefined,
        isActive: updateCardDto.isActive ?? undefined,
      },
    });
  }

  async removeOwned(userId: number, cardId: number) {
    const card = await this.databaseService.card.findUnique({
      where: { id: cardId },
    });
    if (!card) throw new NotFoundException('Card not found');
    if (card.userId !== userId) throw new ForbiddenException('Not your card');

    return this.databaseService.card.delete({
      where: { id: cardId },
    });
  }
}

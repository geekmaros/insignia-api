import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCardLinkDto } from './dto/create-card-link.dto';
import { DatabaseService } from '../database/database.service';
import { UpdateCardLinkDto } from './dto/update-card-link.dto';
import { ReorderCardLinkDto } from './dto/reorder-card-link.dto';
import {
  CardLinkInputDto,
  ReplaceCardLinksDto,
} from './dto/replace-card-link.dto';

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

  async replaceAll(
    userId: number,
    cardId: number,
    incomingLinks: CardLinkInputDto[],
  ) {
    // 1. Verify ownership
    const card = await this.databaseService.card.findFirst({
      where: { id: cardId, userId },
    });

    if (!card) {
      throw new ForbiddenException('Access denied');
    }

    // 2. Fetch existing links
    const existingLinks = await this.databaseService.cardLink.findMany({
      where: { cardId },
    });

    const existingIds = new Set(existingLinks.map((l) => l.id));
    const incomingIds = new Set(
      incomingLinks.filter((l) => l.id).map((l) => l.id!),
    );

    // 3. Delete removed
    const toDelete = existingLinks.filter((l) => !incomingIds.has(l.id));

    await this.databaseService.$transaction([
      ...toDelete.map((l) =>
        this.databaseService.cardLink.delete({ where: { id: l.id } }),
      ),

      // 4. Create & update IN ONE PASS (this is the key)
      ...incomingLinks.map((l, index) => {
        if (l.id) {
          return this.databaseService.cardLink.update({
            where: { id: l.id },
            data: {
              type: l.type,
              label: l.label,
              value: l.value,
              position: index,
            },
          });
        }

        return this.databaseService.cardLink.create({
          data: {
            cardId,
            type: l.type,
            label: l.label,
            value: l.value,
            position: index,
          },
        });
      }),
    ]);

    // 5. Return final state
    return this.databaseService.cardLink.findMany({
      where: { cardId },
      orderBy: { position: 'asc' },
    });
  }

  async reorder(
    userId: number,
    cardId: number,
    reorderCardLinkDto: ReorderCardLinkDto,
  ) {
    // verify card ownership
    const card = await this.databaseService.card.findFirst({
      where: {
        id: cardId,
        userId,
      },
    });
    if (!card) throw new ForbiddenException('You do not own this card');

    // fetch existing links
    const links = await this.databaseService.cardLink.findMany({
      where: {
        cardId,
        isActive: true,
      },
      select: { id: true },
    });

    const existingIds = links.map((link) => link.id);
    const incomingIds = reorderCardLinkDto.orderedLinkIds;

    console.log(existingIds);
    console.log(incomingIds);

    if (existingIds.length !== incomingIds.length) {
      throw new BadRequestException('Invalid link count');
    }
    const uniqueIds = new Set(incomingIds);

    // verify incoming ids are valid
    if (uniqueIds.size !== incomingIds.length) {
      throw new BadRequestException('Duplicate link');
    }

    for (const id of incomingIds) {
      if (!existingIds.includes(id)) {
        throw new BadRequestException(
          `Link ${id} does not belong to this card`,
        );
      }
    }

    // transactional update
    await this.databaseService.$transaction(
      incomingIds.map((id, index) => {
        return this.databaseService.cardLink.update({
          where: { id },
          data: { position: index },
        });
      }),
    );

    return {
      success: true,
    };
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

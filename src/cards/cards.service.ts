import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { DatabaseService } from '../database/database.service';

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
        prefix: createCardDto.prefix,
        suffix: createCardDto.suffix,
        accreditation: createCardDto.accreditation,
        department: createCardDto.department,
        company: createCardDto.company,
        headline: createCardDto.headline,
      },
    });
  }

  async findPublicBySlug(slug: string) {
    return this.databaseService.card.findFirst({
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
  }

  findAll() {
    return `This action returns all cards`;
  }

  findOne(id: number) {
    return `This action returns a #${id} card`;
  }

  update(id: number, updateCardDto: UpdateCardDto) {
    return `This action updates a #${id} card`;
  }

  remove(id: number) {
    return `This action removes a #${id} card`;
  }
}

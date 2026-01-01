import {
  Body,
  Controller,
  Param,
  Patch,
  Delete,
  Post,
  UseGuards,
  Put,
} from '@nestjs/common';
import { CardLinksService } from './card-links.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { User } from '../types/req.type';
import { CreateCardLinkDto } from './dto/create-card-link.dto';
import { ParseIntPipe } from '@nestjs/common';
import { ReorderCardLinkDto } from './dto/reorder-card-link.dto';
import { ReplaceCardLinksDto } from './dto/replace-card-link.dto';

@UseGuards(JwtAuthGuard)
@Controller('cards/:cardId/links')
export class CardLinksController {
  constructor(private readonly cardLinksService: CardLinksService) {}

  @Post()
  addLink(
    @CurrentUser() user: User,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body() createCardLinkDto: CreateCardLinkDto,
  ) {
    return this.cardLinksService.addLink(
      user.userId,
      cardId,
      createCardLinkDto,
    );
  }
  @Put()
  replaceLinks(
    @CurrentUser() user: User,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body() replaceCardLinkDto: ReplaceCardLinksDto,
  ) {
    return this.cardLinksService.replaceAll(
      user.userId,
      cardId,
      replaceCardLinkDto.links,
    );
  }

  @Patch('reorder')
  reorderLinks(
    @CurrentUser() user: User,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body() reorderCardLinkDto: ReorderCardLinkDto,
  ) {
    return this.cardLinksService.reorder(
      user.userId,
      cardId,
      reorderCardLinkDto,
    );
  }

  @Patch(':linkId')
  updateLink(
    @CurrentUser() user: User,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Param('linkId', ParseIntPipe) linkId: number,
    @Body() updateCardLinkDto: CreateCardLinkDto,
  ) {
    return this.cardLinksService.updateLink(
      user.userId,
      cardId,
      linkId,
      updateCardLinkDto,
    );
  }

  @Delete(':linkId')
  removeLink(
    @CurrentUser() user: User,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Param('linkId', ParseIntPipe) linkId: number,
  ) {
    return this.cardLinksService.removeLink(user.userId, cardId, linkId);
  }
}

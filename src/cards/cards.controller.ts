import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { User } from '../types/req.type';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser() user: User, @Body() createCardDto: CreateCardDto) {
    return this.cardsService.create(user.userId, createCardDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@CurrentUser() user: User) {
    return this.cardsService.findAll(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.cardsService.findOwnedById(user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/dashboard')
  getDashbaord(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) cardId: number,
  ) {
    return this.cardsService.getDashboard(user.userId, cardId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/qr')
  getQR(@CurrentUser() user: User, @Param('id', ParseIntPipe) cardId: number) {
    return this.cardsService.getQrPayload(user.userId, cardId);
  }

  @Get('public/:slug')
  findPublic(@Param('slug') slug: string) {
    return this.cardsService.findPublicBySlug(slug);
  }

  @Get('public/:slug/meta')
  getPublicMeta(@Param('slug') slug: string) {
    return this.cardsService.getPublicMeta(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    return this.cardsService.updateOwned(user.userId, id, updateCardDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.cardsService.removeOwned(user.userId, id);
  }
}

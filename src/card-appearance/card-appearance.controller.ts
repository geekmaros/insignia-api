import {
  Controller,
  Body,
  Param,
  Put,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CardAppearanceService } from './card-appearance.service';
import { UpdateCardAppearanceDto } from './dto/update-card-appearance.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import type { User } from '../types/req.type';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cards/:cardId/appearance')
export class CardAppearanceController {
  constructor(private readonly cardAppearanceService: CardAppearanceService) {}

  @Put()
  update(
    @CurrentUser() user: User,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body() updateCardAppearanceDto: UpdateCardAppearanceDto,
  ) {
    return this.cardAppearanceService.upsert(
      user.userId,
      cardId,
      updateCardAppearanceDto,
    );
  }
}
